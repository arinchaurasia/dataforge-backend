const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
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

    const info = await transporter.sendMail(mailOptions);
    console.log("Email successfully sent: " + info.response);

  } catch (error) {
    console.error("CRITICAL EMAIL ERROR: ", error);
  }
};

module.exports = sendEmail;
