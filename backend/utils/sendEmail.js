const axios = require('axios');

/**
 * Robust Email Utility - VERSION 10 (DIRECT REST API)
 * Bypassing all SDK versioning issues by calling the Brevo REST API directly via Axios.
 * This is the most reliable method as it has zero dependency on the Brevo library structure.
 */
const sendEmail = async (options) => {
  console.log("📨 Attempting to send email via Brevo REST API to:", options.email);

  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { 
        name: "DataForge Pro", 
        email: process.env.EMAIL_USER 
      },
      to: [{ 
        email: options.email 
      }],
      subject: options.subject,
      htmlContent: `
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
      `
    }, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log("✨ Email sent successfully via Brevo REST API! ID:", response.data.messageId);
    return response.data;

  } catch (error) {
    console.error("❌ BREVO REST API FAILURE:", error.response?.data?.message || error.message);
    if (error.response && error.response.data) {
      console.error("Full API Error Details:", JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
};

module.exports = sendEmail;
