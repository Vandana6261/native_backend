import nodemailer from 'nodemailer';

/**
 * Create Nodemailer transporter from environment variables
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send OTP to user's email address
 * @param {string} toEmail - Recipient email
 * @param {string} otp - 6-digit OTP code
 */
export const sendOtpEmail = async (toEmail, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM || 'Backend Native'}" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Your Verification Code (OTP)',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333333; text-align: center;">Account Verification</h2>
        <p style="color: #555555; font-size: 16px;">Hello,</p>
        <p style="color: #555555; font-size: 16px;">Your verification code for signup is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4F46E5; background-color: #EEF2FF; padding: 10px 25px; border-radius: 6px; border: 1px dashed #6366F1;">
            ${otp}
          </span>
        </div>
        <p style="color: #777777; font-size: 14px;">This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #aaa; font-size: 12px; text-align: center;">Backend Native Authentication System</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};
