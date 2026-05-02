const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS  
    }
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
