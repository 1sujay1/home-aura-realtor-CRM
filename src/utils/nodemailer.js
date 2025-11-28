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

export const sendContactMail = async ({
  name,
  email,
  message,
  phone,
  secondaryPhone,
}) => {
  const mailOptions = {
    from: `Home Aura Realtor "${name}" <${email}>`,
    to: process.env.NODEMAILER_RECEIVER_EMAIL,
    subject: "Home Aura Realtor Contact Form Submission",
    cc: ["sujaymastern@gmail.com", "visupriya.udt@gmail.com"],
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${
        secondaryPhone
          ? `<p><strong>Secondary Phone:</strong> ${secondaryPhone}</p>`
          : ``
      }
    `,
  };

  return transporter.sendMail(mailOptions); // returns a promise
};
const Clients = {
  HOME_AURA_REALTOR: {
    name: "Home Aura Realtor",
    user: process.env.HOME_AURA_REALTOR_NODE_MAILER_EMAIL,
    pass: process.env.HOME_AURA_REALTOR_NODE_MAILER_PASSWORD,
    ccMail: process.env.HOME_AURA_REALTOR_CC_EMAILS
      ? JSON.parse(process.env.HOME_AURA_REALTOR_CC_EMAILS)
      : [],
    receiverEmail: process.env.HOME_AURA_REALTOR_RECEIVER_EMAIL,
    displayEmail: "projects@homeaurarealtor.com",
  },
  URBANRISE_PARADISE_ON_EARTH: {
    name: "Urbanrise Paradise on Earth",
    user: process.env.HOME_AURA_REALTOR_NODE_MAILER_EMAIL,
    pass: process.env.HOME_AURA_REALTOR_NODE_MAILER_PASSWORD,
    ccMail: process.env.HOME_AURA_REALTOR_CC_EMAILS
      ? JSON.parse(process.env.HOME_AURA_REALTOR_CC_EMAILS)
      : [],
    receiverEmail: process.env.HOME_AURA_REALTOR_RECEIVER_EMAIL,
    displayEmail: "projects@homeaurarealtor.com",
  },
  ABHEE_CODENAME_YOU: {
    name: "Abhee Codename You",
    user: process.env.HOME_AURA_REALTOR_NODE_MAILER_EMAIL,
    pass: process.env.HOME_AURA_REALTOR_NODE_MAILER_PASSWORD,
    ccMail: process.env.HOME_AURA_REALTOR_CC_EMAILS
      ? JSON.parse(process.env.HOME_AURA_REALTOR_CC_EMAILS)
      : [],
    receiverEmail: process.env.HOME_AURA_REALTOR_RECEIVER_EMAIL,
    displayEmail: "projects@abheecodenameyou.com",
  },
  GODREJ_LAKESIDE_ORCHARD: {
    name: "Godrej Lakeside Orchard",
    user: process.env.HOME_AURA_REALTOR_NODE_MAILER_EMAIL,
    pass: process.env.HOME_AURA_REALTOR_NODE_MAILER_PASSWORD,
    ccMail: process.env.HOME_AURA_REALTOR_CC_EMAILS
      ? JSON.parse(process.env.HOME_AURA_REALTOR_CC_EMAILS)
      : [],
    receiverEmail: process.env.HOME_AURA_REALTOR_RECEIVER_EMAIL,
    displayEmail: "projects@godrejlakesideorchard.com",
  },
  INTERIORS_HOME_AURA_REALTOR: {
    name: "Interiors Home Aura Realtor",
    user: process.env.HOME_AURA_REALTOR_NODE_MAILER_EMAIL,
    pass: process.env.HOME_AURA_REALTOR_NODE_MAILER_PASSWORD,
    ccMail: process.env.HOME_AURA_REALTOR_CC_EMAILS
      ? JSON.parse(process.env.HOME_AURA_REALTOR_CC_EMAILS)
      : [],
    receiverEmail: process.env.HOME_AURA_REALTOR_RECEIVER_EMAIL,
    displayEmail: "projects@interiorshomeaurarealtor.com",
  },
  PROVIDENT_SUNWORTH_CITY: {
    name: "Provident Sunworth City",
    user: process.env.HOME_AURA_REALTOR_NODE_MAILER_EMAIL,
    pass: process.env.HOME_AURA_REALTOR_NODE_MAILER_PASSWORD,
    ccMail: process.env.HOME_AURA_REALTOR_CC_EMAILS
      ? JSON.parse(process.env.HOME_AURA_REALTOR_CC_EMAILS)
      : [],
    receiverEmail: process.env.HOME_AURA_REALTOR_RECEIVER_EMAIL,
    displayEmail: "projects@providentsunworthcity.com",
  },
  PURAVANKARA: {
    name: "Puravankara",
    user: process.env.HOME_AURA_REALTOR_NODE_MAILER_EMAIL,
    pass: process.env.HOME_AURA_REALTOR_NODE_MAILER_PASSWORD,
    ccMail: process.env.HOME_AURA_REALTOR_CC_EMAILS
      ? JSON.parse(process.env.HOME_AURA_REALTOR_CC_EMAILS)
      : [],
    receiverEmail: process.env.HOME_AURA_REALTOR_RECEIVER_EMAIL,
    displayEmail: "projects@puravankaracodenamebliss.com",
  },
  GODREJ_HOMES_PROJECT: {
    name: "Godrej Homes Project",
    user: process.env.HOME_AURA_REALTOR_NODE_MAILER_EMAIL,
    pass: process.env.HOME_AURA_REALTOR_NODE_MAILER_PASSWORD,
    ccMail: process.env.HOME_AURA_REALTOR_CC_EMAILS
      ? JSON.parse(process.env.HOME_AURA_REALTOR_CC_EMAILS)
      : [],
    receiverEmail: process.env.HOME_AURA_REALTOR_RECEIVER_EMAIL,
    displayEmail: "projects@godrejhomesproject.com",
  },
  ASSETZ_PROJECT: {
    name: "Assetz Project",
    user: process.env.HOME_AURA_REALTOR_NODE_MAILER_EMAIL,
    pass: process.env.HOME_AURA_REALTOR_NODE_MAILER_PASSWORD,
    ccMail: process.env.HOME_AURA_REALTOR_CC_EMAILS
      ? JSON.parse(process.env.HOME_AURA_REALTOR_CC_EMAILS)
      : [],
    receiverEmail: process.env.HOME_AURA_REALTOR_RECEIVER_EMAIL,
    displayEmail: "projects@assetzproject.com",
  },
  ABHEE_PROPERTIES: {
    name: "Abhee Properties",
    user: process.env.HOME_AURA_REALTOR_NODE_MAILER_EMAIL,
    pass: process.env.HOME_AURA_REALTOR_NODE_MAILER_PASSWORD,
    ccMail: process.env.HOME_AURA_REALTOR_CC_EMAILS
      ? JSON.parse(process.env.HOME_AURA_REALTOR_CC_EMAILS)
      : [],
    receiverEmail: process.env.HOME_AURA_REALTOR_RECEIVER_EMAIL,
    displayEmail: "projects@abheecodenameyou.com",
  },
  PURAVANKARA_CODENAME_BLISS: {
    name: "Puravankara Codename Bliss",
    user: process.env.HOME_AURA_REALTOR_NODE_MAILER_EMAIL,
    pass: process.env.HOME_AURA_REALTOR_NODE_MAILER_PASSWORD,
    ccMail: process.env.HOME_AURA_REALTOR_CC_EMAILS
      ? JSON.parse(process.env.HOME_AURA_REALTOR_CC_EMAILS)
      : [],
    receiverEmail: process.env.HOME_AURA_REALTOR_RECEIVER_EMAIL,
    displayEmail: "projects@puravankaracodenamebliss.com",
  },
  PURVA_ATMOSPHERE: {
    name: "Purva Atmosphere",
    user: process.env.HOME_AURA_REALTOR_NODE_MAILER_EMAIL,
    pass: process.env.HOME_AURA_REALTOR_NODE_MAILER_PASSWORD,
    ccMail: process.env.HOME_AURA_REALTOR_CC_EMAILS
      ? JSON.parse(process.env.HOME_AURA_REALTOR_CC_EMAILS)
      : [],
    receiverEmail: process.env.HOME_AURA_REALTOR_RECEIVER_EMAIL,
    displayEmail: "projects@puravankaracodenamebliss.com",
  },
  PROVIDENT_DEANSGATE: {
    name: "Provident Deansgate",
    user: process.env.HOME_AURA_REALTOR_NODE_MAILER_EMAIL,
    pass: process.env.HOME_AURA_REALTOR_NODE_MAILER_PASSWORD,
    ccMail: process.env.HOME_AURA_REALTOR_CC_EMAILS
      ? JSON.parse(process.env.HOME_AURA_REALTOR_CC_EMAILS)
      : [],
    receiverEmail: process.env.HOME_AURA_REALTOR_RECEIVER_EMAIL,
    displayEmail: "projects@puravankaracodenamebliss.com",
  },
  SATTVA_SIMPLICITY: {
    name: "Sattva Simplicity",
    user: process.env.HOME_AURA_REALTOR_NODE_MAILER_EMAIL,
    pass: process.env.HOME_AURA_REALTOR_NODE_MAILER_PASSWORD,
    ccMail: process.env.HOME_AURA_REALTOR_CC_EMAILS
      ? JSON.parse(process.env.HOME_AURA_REALTOR_CC_EMAILS)
      : [],
    receiverEmail: process.env.HOME_AURA_REALTOR_RECEIVER_EMAIL,
    displayEmail: "projects@sattvasimplicity.com",
  },
  SATTVA_VASANTA_SKYE: {
    name: "Sattva Vasant Skye",
    user: process.env.SATTVA_VASANTA_NODE_MAILER_EMAIL,
    pass: process.env.SATTVA_VASANTA_NODE_MAILER_PASSWORD,
    ccMail: process.env.SATTVA_VASANTA_CC_EMAILS
      ? JSON.parse(process.env.SATTVA_VASANTA_CC_EMAILS)
      : [],
    receiverEmail: process.env.SATTVA_VASANTA_RECEIVER_EMAIL,
    displayEmail: "projects@sattva-vasantaskye.com",
  },
};
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
export const sendClientContactMail = async ({
  name,
  email,
  message,
  phone,
  project,
  secondaryPhone,
}) => {
  console.log("Mail Data", {
    name,
    email,
    message,
    phone,
    project,
    secondaryPhone,
  });
  let currentClient = Clients[project];
  if (!currentClient) {
    currentClient = Clients["HOME_AURA_REALTOR"];
  }
  const transporter = nodemailer.createTransport({
    service: "gmail", // or configure host/port manually
    auth: {
      user: currentClient.user,
      pass: currentClient.pass,
    },
  });
  const mailOptions = {
    from: `${currentClient.name} "${name}" <${currentClient.displayEmail}>`,
    to: currentClient.receiverEmail,
    subject: `${currentClient.name} Contact Form Submission`,
    cc: currentClient.ccMail,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong> ${escapeHtml(message)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      ${
        secondaryPhone
          ? `<p><strong>Secondary Phone:</strong> ${secondaryPhone}</p>`
          : ``
      }
    `,
  };

  return transporter.sendMail(mailOptions); // returns a promise
};
