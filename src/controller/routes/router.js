import express from "express";
import Lead from "../../models/Lead.js";
import {
  sendClientContactMail,
  sendContactMail,
} from "../../utils/nodemailer.js";
import ClientLead from "../../models/ClientLeads.js";

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
      message,
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
      message,
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
export default router;
