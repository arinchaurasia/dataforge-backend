const nodemailer = require('nodemailer');
const dns = require('dns');

/**
 * Robust Email Utility
 * Optimized for Render deployment and Gmail SMTP
 */
const sendEmail = async (options) => {
  try {
    // 🎯 Use port 587 with STARTTLS and FORCE IPv4
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
      },
      // 🎯 STRICTLY FORCE IPv4 to bypass ENETUNREACH errors on IPv6-restricted networks
      lookup: (hostname, options, callback) => {
        dns.lookup(hostname, { family: 4 }, callback);
      },
      timeout: 10000,
      connectionTimeout: 10000,
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      }
    });

    const mailOptions = {
      from: `"DataForge Pro Security" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      // Add HTML version for better email client support
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b;">
          <div style="background-color: #4f46e5; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800;">DataForge Pro</h1>
          </div>
          <div style="background-color: #f8fafc; padding: 40px; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0; border-top: none;">
            <h2 style="color: #0f172a; margin-top: 0;">Password Reset Request</h2>
            <p style="line-height: 1.6; color: #475569;">You are receiving this email because a password reset was requested for your account.</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${options.message.match(/https?:\/\/[^\s]+/)?.[0] || '#'}" 
                 style="background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.4);">
                Reset Password
              </a>
            </div>
            <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
              If the button above doesn't work, copy and paste this link into your browser:
              <br/>
              <span style="color: #4f46e5; word-break: break-all;">${options.message.match(/https?:\/\/[^\s]+/)?.[0] || ''}</span>
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">
              If you did not request this, please ignore this email. Your password will remain unchanged.
            </p>
          </div>
          <p style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 20px; text-transform: uppercase; letter-spacing: 0.1em;">
            © 2026 DataForge Pro Analytics
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ CRITICAL EMAIL ERROR:", error.message);
    if (error.code === 'EAUTH') {
      console.error("Authentication failed. Please check EMAIL_USER and EMAIL_PASS (App Password).");
    } else if (error.code === 'ENETUNREACH') {
      console.error("Network unreachable. This often happens on Render with IPv6. Ensure the transporter is configured correctly.");
    }
    throw error; // Rethrow to handle in controller
  }
};

module.exports = sendEmail;
