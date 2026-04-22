import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // For development, we can use Ethereal or just console log if not configured
  // In production, user should set these in .env
  let auth = {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  };

  let host = process.env.EMAIL_HOST || 'smtp.ethereal.email';
  let port = process.env.EMAIL_PORT || 587;

  // If no credentials, create a test account automatically
  if (!auth.user || !auth.pass) {
    const testAccount = await nodemailer.createTestAccount();
    auth = {
      user: testAccount.user,
      pass: testAccount.pass,
    };
    host = 'smtp.ethereal.email';
    port = 587;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    auth,
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
