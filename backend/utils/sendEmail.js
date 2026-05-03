const nodemailer = require('nodemailer');
const dns = require('dns');

/**
 * Robust Email Utility - VERSION 4 (HARDCORE IPv4)
 * Bypassing DNS resolution entirely to stop the IPv6 ENETUNREACH error.
 */
const sendEmail = async (options) => {
  console.log("📨 Attempting to send email to:", options.email);

  try {
    // 🎯 We hardcode a known IPv4 address for smtp.gmail.com to bypass DNS issues on Render
    const GMAIL_IPV4 = '74.125.142.108'; 

    console.log(`🚀 Connecting directly to Gmail IPv4: ${GMAIL_IPV4}`);

    const transporter = nodemailer.createTransport({
      host: GMAIL_IPV4,
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
      },
      // 🎯 Mandate IPv4
      family: 4, 
      timeout: 20000,
      connectionTimeout: 20000,
      tls: {
        // 🎯 CRITICAL: We must specify the servername for the SSL certificate to match
        servername: 'smtp.gmail.com',
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"DataForge Pro Security" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
          <h1 style="color: #4f46e5; text-align: center;">DataForge Pro</h1>
          <h2 style="color: #0f172a;">Password Reset</h2>
          <p>You requested a password reset for your DataForge account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${options.message.match(/https?:\/\/[^\s]+/)?.[0] || '#'}" 
               style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 20px;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✨ Email sent successfully! ID:", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ MAIL SYSTEM FAILURE:", error.message);
    console.error("Error Code:", error.code);
    throw error;
  }
};

module.exports = sendEmail;
