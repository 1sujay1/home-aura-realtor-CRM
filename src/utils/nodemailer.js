// nodemailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // or configure host/port manually
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
});

export const sendContactMail = async ({ name, email, message }) => {
  const mailOptions = {
    from: `Home Aura Realtor "${name}" <${email}>`,
    to: process.env.NODEMAILER_RECEIVER_EMAIL,
    subject: "Home Aura Realtor Contact Form Submission",
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  return transporter.sendMail(mailOptions); // returns a promise
};
