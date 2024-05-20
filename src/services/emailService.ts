import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'hardwaretest41@gmail.com',
    pass: 'hardwaretest123'
  }
});

export const sendAlertEmail = async (email: string, subject: string, message: string) => {
  const mailOptions = {
    from: 'hardwaretest41@gmail.com',
    to: email,
    subject: subject,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
