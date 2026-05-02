const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS  
    },
    tls: {
      rejectUnauthorized: false // Helps with some network restrictions
    },
    connectionTimeout: 10000, // 10 seconds timeout
  });

  const mailOptions = {
    from: '"DataForge Pro Security" <no-reply@dataforge.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Nodemailer Error:', error.message);
    throw new Error('Failed to send verification email. Please check your EMAIL_PASS and connection.');
  }
};

module.exports = sendEmail;
