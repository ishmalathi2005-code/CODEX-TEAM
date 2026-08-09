const nodemailer = require('nodemailer');
const config = require('../config/config');

/**
 * Create a nodemailer transporter
 */
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: config.email.host,
    port: config.email.port,
    secure: Number(config.email.port) === 465,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });
};

/**
 * Send a password reset email
 */
const sendPasswordReset = async (toEmail, name, resetUrl) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: config.email.from,
    to: toEmail,
    subject: 'CODEX — Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">CODEX AI Interview Simulator</h2>
        <h3>Password Reset Request</h3>
        <p>Hi ${name},</p>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <a href="${resetUrl}" style="
          display: inline-block;
          background-color: #4f46e5;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 16px 0;
        ">Reset Password</a>
        <p>This link will expire in <strong>30 minutes</strong>.</p>
        <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #888; font-size: 12px;">CODEX AI Interview Simulator</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send a welcome email after registration
 */
const sendWelcome = async (toEmail, name) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: config.email.from,
    to: toEmail,
    subject: 'Welcome to CODEX AI Interview Simulator! 🚀',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">Welcome to CODEX! 🎉</h2>
        <p>Hi ${name},</p>
        <p>Your account has been created successfully. You're now ready to practice interviews and level up your career!</p>
        <p>Here's what you can do:</p>
        <ul>
          <li>Take AI-powered mock interviews</li>
          <li>Get instant feedback and scoring</li>
          <li>Track your progress over time</li>
          <li>Get personalized skill recommendations</li>
        </ul>
        <p>Good luck on your journey! 💪</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #888; font-size: 12px;">CODEX AI Interview Simulator</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendPasswordReset,
  sendWelcome,
};
