import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 465,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: 'sharifmajumdar@gmail.com',
      pass: 'rtro thid vyer quqk',
    },
  });

  await transporter.sendMail({
    from: 'sharifmajumdar@gmail.com',
    to,
    subject: 'Reset your password within ten mins!',
    text: '',
    html,
  });
};
