const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'sadidkhan567@gmail.com',
  subject: 'Test Email',
  text: 'This is a test email.',
}).then(() => console.log('Email sent'))
  .catch(err => console.error('Email error:', err));