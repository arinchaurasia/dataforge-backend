const axios = require('axios');

/**
 * Robust Email Utility - VERSION 11 (DYNAMIC TEMPLATES)
 * Now supports both OTP verification and Password Reset templates.
 */
const sendEmail = async (options) => {
  console.log("📨 Attempting to send email via Brevo REST API to:", options.email);

  try {
    if (!process.env.BREVO_API_KEY || process.env.BREVO_API_KEY === 'your_brevo_api_key_here') {
      throw new Error("BREVO_API_KEY is missing or not configured in environment variables.");
    }

    // 🎯 Decide which template to use based on the subject or content
    const isOTP = options.subject.toLowerCase().includes('verify') || options.subject.toLowerCase().includes('code');
    
    let htmlContent = '';

    if (isOTP) {
      // 🎯 OTP Template
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
          <h1 style="color: #4f46e5; text-align: center;">DataForge Pro</h1>
          <h2 style="color: #0f172a; text-align: center;">Verify Your Account</h2>
          <p style="text-align: center;">Please use the following 6-digit code to complete your registration:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f1f5f9; color: #4f46e5; padding: 20px; border-radius: 12px; font-size: 32px; font-weight: 900; letter-spacing: 10px; display: inline-block; border: 1px solid #e2e8f0;">
              ${options.message.match(/\d{6}/)?.[0] || options.message}
            </div>
          </div>
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 20px;">
            If you did not create this account, please ignore this email.
          </p>
        </div>
      `;
    } else {
      // 🎯 Password Reset Template
      htmlContent = `
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
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 20px;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      `;
    }

    const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: "DataForge Pro", email: process.env.EMAIL_USER },
      to: [{ email: options.email }],
      subject: options.subject,
      htmlContent: htmlContent
    }, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log("✨ Email sent successfully! ID:", response.data.messageId);
    return response.data;

  } catch (error) {
    console.error("❌ BREVO REST API FAILURE:", error.response?.data?.message || error.message);
    throw error;
  }
};

module.exports = sendEmail;
