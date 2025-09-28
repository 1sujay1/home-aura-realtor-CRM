import express from "express";
import Lead from "../../models/Lead.js";
import {
  sendClientContactMail,
  sendContactMail,
} from "../../utils/nodemailer.js";
import ClientLead from "../../models/ClientLeads.js";
import { fetchLead } from "../../utils/fetchLead.js";

const router = express.Router();

// Simple test route
router.get("/ping", (req, res) => {
  res.send("pong");
});

router.post("/contact", async (req, res) => {
  const { name, email, message, phone, project, secondaryPhone } = req.body;

  if (!name || !phone)
    return res.status(400).json({ message: "All fields required" });

  let mailStatus = "success";

  try {
    await sendContactMail({ name, email, message, phone, secondaryPhone });
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

  const data = req.body;

  if (data.field === "leadgen") {
    const leadId = data.value.leadgen_id;
    console.log("📩 New Lead ID:", leadId);

    // Step 2: fetch full lead details using Graph API
    const leadDetails = await fetchLead(leadId, PAGE_ACCESS_TOKEN);
    console.log("Full lead:********************", leadDetails);
    res.json(leadDetails);
    // Step 3: Send email with lead info
    // await sendMail(JSON.stringify(leadDetails, null, 2));
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

export default router;
