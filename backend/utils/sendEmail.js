const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    family: 4, // Force IPv4
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
    console.error('FULL NODEMAILER ERROR:', error);
    throw new Error(`Email failed: ${error.message}`);
  }
};

module.exports = sendEmail;
