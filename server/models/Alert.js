const pool = require('../db/pool');

const Alert = {
  async syncForUser(userId, generatedAlerts = []) {
    const fingerprints = [];

    for (const alert of generatedAlerts) {
      const fingerprint = `${alert.severity || alert.type || 'info'}|${alert.title}|${alert.message || alert.desc}`;
      fingerprints.push(fingerprint);
      await pool.query(
        `INSERT INTO alerts (user_id, fingerprint, title, message, severity)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id, fingerprint)
         DO UPDATE SET
           title = EXCLUDED.title,
           message = EXCLUDED.message,
           severity = EXCLUDED.severity`,
        [userId, fingerprint, alert.title, alert.message || alert.desc, alert.severity || alert.type || 'info']
      );
    }

    if (fingerprints.length > 0) {
      await pool.query(
        'DELETE FROM alerts WHERE user_id = $1 AND fingerprint <> ALL($2::text[])',
        [userId, fingerprints]
      );
    } else {
      await pool.query('DELETE FROM alerts WHERE user_id = $1', [userId]);
    }
  },

  async findAllByUser(userId) {
    const { rows } = await pool.query(
      `SELECT id, title, message, severity AS type, is_read, created_at
       FROM alerts
       WHERE user_id = $1
       ORDER BY is_read ASC, created_at DESC`,
      [userId]
    );

    return rows.map((row) => ({
      ...row,
      desc: row.message,
    }));
  },

  async markAsRead(userId, alertId) {
    const { rows } = await pool.query(
      `UPDATE alerts
       SET is_read = true
       WHERE user_id = $1 AND id = $2
       RETURNING id, title, message, severity AS type, is_read, created_at`,
      [userId, alertId]
    );

    return rows[0] ? { ...rows[0], desc: rows[0].message } : null;
  },

  async markAllAsRead(userId) {
    await pool.query('UPDATE alerts SET is_read = true WHERE user_id = $1', [userId]);
  },
};

module.exports = Alert;
