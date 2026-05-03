const Brevo = require('@getbrevo/brevo');

/**
 * Robust Email Utility - VERSION 7 (BREVO API)
 * Bypassing Render's SMTP firewall and Resend's domain restriction.
 * Brevo allows sending from a verified Gmail address even without a custom domain.
 */
const sendEmail = async (options) => {
  console.log("📨 Attempting to send email via Brevo API to:", options.email);

  try {
    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new Brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = `
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
    sendSmtpEmail.sender = { "name": "DataForge Pro", "email": process.env.EMAIL_USER };
    sendSmtpEmail.to = [{ "email": options.email }];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✨ Email sent successfully via Brevo API! Message ID:", data.messageId);
    return data;

  } catch (error) {
    console.error("❌ BREVO API FAILURE:", error.message);
    // Log more details if available
    if (error.response && error.response.body) {
      console.error("Brevo Error Details:", JSON.stringify(error.response.body, null, 2));
    }
    throw error;
  }
};

module.exports = sendEmail;
