import express from "express";
import Lead from "../../models/Lead.js";
import {
  sendClientContactMail,
  sendContactMail,
} from "../../utils/nodemailer.js";
import ClientLead from "../../models/ClientLeads.js";
import { fetchLead } from "../../utils/fetchLead.js";
import { FORM_DATA } from "../../utils/constants.js";
import { sendKyraContactMail } from "../../utils/kyraNodemailer.js";

const router = express.Router();

// Simple test route
router.get("/ping", (req, res) => {
  res.send("pong");
});

router.post("/contact", async (req, res) => {
  const { name, email, message, source, phone, project, secondaryPhone } =
    req.body;
  console.log("Contact Req Body:", req.body);
  if (!name || !phone)
    return res.status(400).json({ message: "All fields required" });

  let mailStatus = "success";
  let postPayload = { name, email, message, phone, secondaryPhone };
  if (source) postPayload.source = source;
  if (project) postPayload.project = project;
  console.log("Contact form payload:", postPayload);
  try {
    await sendContactMail(postPayload);
  } catch (error) {
    console.error("Error sending mail:", error);
    mailStatus = "failed";
  }

  //   if (mailStatus === "success") {
  //     res.status(200).json({ message: "Thank you for contacting" });
  //   } else {
  //     res.status(500).json({ message: "Mail failed. Lead still saved." });
  //   }

  // Save lead regardless of mail success/failure
  try {
    const leadResp = await Lead.create({
      name,
      email,
      phone,
      message,
      mailStatus,
      secondaryPhone,
      project: project || "HOME_AURA_REALTOR",
      source: "HOME_AURA_REALTOR",
    });
    if (leadResp._id) {
      return res.status(200).json({
        status: 200,
        message: "Thank you for contacting us. We will get back to you soon.",
      });
    }
    return res.json({
      status: 500,
      message: "Failed to Submit, Please try again later.",
    });
  } catch (dbErr) {
    console.error("Failed to save lead:", dbErr);
    return res.json({
      status: 500,
      message: "Failed to Submit, Please try again later.",
    });
  }
});
router.post("/client/contact", async (req, res) => {
  console.log("Client Contact Req Body:", req.body);
  const { name, email, message, phone, source, project, secondaryPhone } =
    req.body;

  if (!name || !phone)
    return res.status(400).json({ message: "All fields required" });

  let mailStatus = "success";

  try {
    await sendClientContactMail({
      name,
      email,
      message: message || "",
      phone,
      project,
      secondaryPhone,
    });
  } catch (error) {
    console.error("Error sending mail:", error);
    mailStatus = "failed";
  }

  //   if (mailStatus === "success") {
  //     res.status(200).json({ message: "Thank you for contacting" });
  //   } else {
  //     res.status(500).json({ message: "Mail failed. Lead still saved." });
  //   }

  // Save lead regardless of mail success/failure
  try {
    const leadResp = await ClientLead.create({
      name,
      email,
      phone,
      message: message || "",
      mailStatus,
      secondaryPhone,
      source: source || "PORTAL",
      project,
    });
    if (leadResp._id) {
      return res.status(200).json({
        status: 200,
        message: "Thank you for contacting us. We will get back to you soon.",
      });
    }
    return res.json({
      status: 500,
      message: "Failed to Submit, Please try again later.",
    });
  } catch (dbErr) {
    console.error("Failed to save lead:", dbErr);
    return res.json({
      status: 500,
      message: "Failed to Submit, Please try again later.",
    });
  }
});

const VERIFY_TOKEN = "fb_leads_secret"; // use the same in FB webhook setup
const PAGE_ACCESS_TOKEN =
  "EAALhuwyEBSsBPiwcjgY8OP639yN2tkZBmm3hx3Vi7suSnLOljNTF5AUoRXZBVhTAT0gPzMfnjpoWcZAqMP4KEBcWQWOZCgKTH4dZBZCpZCU6FygXM7MKskj715hbq7wSAvYbZCPJTNlhrTsFYJjeWxLwXooiWsW2ZCUMePMUac5gugFOybDV7tKZAQCF9nxP2mNsYRu0ePSICf73lV1DM80ssX"; // will be added later

// ✅ Step 1: Verification (Facebook calls this when setting up webhook)
router.get("/webhook", (req, res) => {
  console.log("Webhook verification request:", req.query);
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("Webhook verified ✅");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});
// ✅ Step 2: Facebook will POST leads here
router.post("/webhook", async (req, res) => {
  console.log("Webhook event:", JSON.stringify(req.body, null, 2));

  if (req.body.entry) {
    for (let entry of req.body.entry) {
      if (entry.changes) {
        for (let change of entry.changes) {
          if (change.field === "leadgen") {
            const leadId = change.value.leadgen_id;
            const formId = change.value.form_id;
            const form = FORM_DATA.find((form) => form.id === formId);
            console.log("📩 New Lead ID:", leadId);
            console.log("📩 New Form ID:", form);
            let formName = form ? form.name : "FACE_BOOK_LEAD";
            try {
              // Fetch full lead details from FB Graph API
              const lead = await fetchLead(leadId, PAGE_ACCESS_TOKEN);
              // const lead = {
              //   created_time: "2025-10-02T08:02:42+0000",
              //   id: "1449736202763543",
              //   field_data: [
              //     {
              //       name: "email",
              //       values: ["test@fb.com"],
              //     },
              //     {
              //       name: "phone",
              //       values: ["dummy data for phone"],
              //     },
              //     {
              //       name: "full_name",
              //       values: ["dummy data for full_name"],
              //     },
              //   ],
              // };

              console.log("Lead details:", lead);

              // Extract name, email, phone
              const leadData = {};
              if (lead.field_data && Array.isArray(lead.field_data)) {
                lead.field_data.forEach((field) => {
                  const key = field.name;
                  const value = field.values[0]; // Take first value
                  leadData[key] = value;
                });
              }

              console.log("Parsed leadData:", leadData);
              const { full_name, email, phone, name, mobile } = leadData;

              const contactFormData = await fetch(
                `${process.env.BACKEND_URL}/api/v1/contact`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: full_name || name,
                    email,
                    phone: phone || mobile,
                    project: formName,
                    source: "FACEBOOK",
                    message: "Lead from Facebook",
                    secondaryPhone: "",
                  }),
                },
              );

              console.log(
                "✅ Lead saved and email triggered",
                contactFormData.json(),
              );
            } catch (err) {
              console.error("Error fetching or saving lead:", err);
            }
          }
        }
      }
    }
  }

  res.sendStatus(200);
});

// ✅ Helper: Fetch lead details from Facebook
// async function fetchLead(leadId) {
//   const response = await fetch(
//     `https://graph.facebook.com/v20.0/${leadId}?access_token=${PAGE_ACCESS_TOKEN}`
//   );
//   return await response.json();
// }

router.post("/kyra/contact", async (req, res) => {
  console.log("Client Contact Req Body:", req.body);
  const { name, email, message, phone, source, project, secondaryPhone } =
    req.body;

  if (!name || !phone)
    return res.status(400).json({ message: "All fields required" });

  let mailStatus = "success";

  try {
    await sendKyraContactMail({
      name,
      email,
      message: message || "",
      phone,
      project,
      secondaryPhone,
    });
    return res.status(200).json({
      status: 200,
      message: "Thank you for contacting us. We will get back to you soon.",
    });
  } catch (error) {
    console.error("Error sending mail:", error);
    mailStatus = "failed";
    return res.json({
      status: 500,
      message: "Failed to Submit, Please try again later.",
    });
  }
});

export default router;
