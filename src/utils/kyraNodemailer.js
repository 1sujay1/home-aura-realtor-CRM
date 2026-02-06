// nodemailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // or configure host/port manually
  auth: {
    user: "kyragroupindia.api@gmail.com",
    pass: "ffba jhyu mopi caqg",
  },
});
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
export const sendKyraContactMail = async ({
  name,
  email,
  message,
  phone,
  secondaryPhone,
}) => {
  const mailOptions = {
    from: `Kyra Group India "${escapeHtml(name)}" <${escapeHtml(email)}>`,
    to: "visupriya.udt@gmail.com",
    subject: "Kyra Group India Contact Form Submission",
    cc: ["sujaymastern@gmail.com", "visupriya.udt@gmail.com"],
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong> ${escapeHtml(message)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      ${
        secondaryPhone
          ? `<p><strong>Secondary Phone:</strong> ${escapeHtml(secondaryPhone)}</p>`
          : ``
      }
    `,
  };

  return transporter.sendMail(mailOptions); // returns a promise
};
