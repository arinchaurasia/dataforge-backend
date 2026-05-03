const nodemailer = require('nodemailer');
const dns = require('dns');

/**
 * Robust Email Utility - VERSION 3
 * Specifically engineered to overcome IPv6 ENETUNREACH issues on Render/Cloud.
 */
const sendEmail = async (options) => {
  console.log("📨 Attempting to send email to:", options.email);

  try {
    // 🎯 Use Port 465 (SSL) which is often more reliable than 587 on some cloud networks
    // 🎯 We use a custom lookup to FORCE IPv4 resolution
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
      },
      // 🎯 THE KEY FIX: Force IPv4 at the socket level
      family: 4, 
      // 🎯 Custom DNS lookup to ensure we never even see an IPv6 address
      lookup: (hostname, options, callback) => {
        console.log(`🔍 Resolving ${hostname} via IPv4...`);
        dns.lookup(hostname, { family: 4 }, (err, address, family) => {
          if (err) console.error("❌ DNS Lookup Error:", err);
          console.log(`✅ Resolved to: ${address} (IPv${family})`);
          callback(err, address, family);
        });
      },
      timeout: 15000,
      connectionTimeout: 15000,
      tls: {
        rejectUnauthorized: false,
        servername: 'smtp.gmail.com'
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
          <h2 style="color: #0f172a;">Password Reset Request</h2>
          <p>You requested a password reset for your DataForge account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${options.message.match(/https?:\/\/[^\s]+/)?.[0] || '#'}" 
               style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 12px; color: #64748b;">If you did not request this, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✨ Email sent successfully! ID:", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ MAIL SYSTEM FAILURE:", error.message);
    console.error("Error Code:", error.code);
    console.error("Full Error details:", JSON.stringify(error, null, 2));
    throw error;
  }
};

module.exports = sendEmail;
