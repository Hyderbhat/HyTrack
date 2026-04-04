const fs = require('fs/promises');
const path = require('path');
let nodemailer = null;

try {
  nodemailer = require('nodemailer');
} catch {
  nodemailer = null;
}

const OUTBOX_DIR = path.join(__dirname, '..', 'outbox');

async function sendPasswordResetEmail({ to, resetLink }) {
  const subject = 'HyTrack password reset';
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #102027;">
      <h2>Reset your HyTrack password</h2>
      <p>Click the link below to choose a new password. This link expires in 15 minutes.</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
    </div>
  `;

  const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_FROM;
  if (smtpConfigured && nodemailer) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS || '',
      } : undefined,
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });

    return { delivery: 'smtp' };
  }

  await fs.mkdir(OUTBOX_DIR, { recursive: true });
  const fileName = `${Date.now()}-${to.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
  const filePath = path.join(OUTBOX_DIR, fileName);
  await fs.writeFile(filePath, `<h1>${subject}</h1>${html}`, 'utf8');
  return { delivery: 'outbox', filePath };
}

module.exports = { sendPasswordResetEmail };
