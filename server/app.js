const express = require('express');
const path = require('path');
const cors = require('cors');
const pool = require('./db/pool');
const { initDatabase } = require('./db/init');
const { requireAuth } = require('./middleware/requireAuth');

const authRouter = require('./routes/auth');
const transactionsRouter = require('./routes/transactions');
const insightsRouter = require('./routes/insights');
const alertsRouter = require('./routes/alerts');
const personalityRouter = require('./routes/personality');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/transactions', requireAuth, transactionsRouter);
app.use('/api/insights', requireAuth, insightsRouter);
app.use('/api/alerts', requireAuth, alertsRouter);
app.use('/api/personality', requireAuth, personalityRouter);

app.get('/api/health', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', timestamp: new Date() });
  } catch (error) {
    next(error);
  }
});

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

async function startServer() {
  await initDatabase();

  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => {
      console.log(`HyTrack server running on http://localhost:${PORT}`);
      resolve(server);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the existing process or change PORT in server/.env.`);
      }

      reject(error);
    });
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
}

module.exports = { app, startServer };
