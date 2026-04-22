import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // For development, we can use Ethereal or just console log if not configured
  // In production, user should set these in .env
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    auth: {
      user: process.env.EMAIL_USER || 'mock_user',
      pass: process.env.EMAIL_PASS || 'mock_pass',
    },
  });

  const mailOptions = {
    from: `"Flatmate Finder" <${process.env.EMAIL_FROM || 'no-reply@flatmatefinder.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    // If using ethereal, log the preview URL
    if (transporter.options.host === 'smtp.ethereal.email') {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Error sending email:', error);
    // Even if email fails in dev, don't crash the whole process, 
    // just log it so the dev knows they need to fix credentials.
  }
};

export default sendEmail;
