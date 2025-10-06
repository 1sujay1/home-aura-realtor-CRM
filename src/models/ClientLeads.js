// Mongoose schema for leads (Lead)
import mongoose from "mongoose";

const ClientLeadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    secondaryPhone: String,
    source: {
      type: String,
      enum: [
        "PORTAL",
        "FACEBOOK",
        "INSTAGRAM",
        "WHATSAPP",
        "REFERRAL",
        "OTHER",
      ],
      default: "PORTAL",
    }, // Default source
    mailStatus: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    }, // Status of the contact mail
    message: { type: String },
    project: { type: String },
    status: {
      type: String,
      enum: [
        "New / Fresh Lead",
        "Contacted / Attempted to Contact",
        "Interested / Warm Lead",
        "Not Interested",
        "No Response",
        "Call scheduled",
        "Follow-Up Scheduled",
        "Follow through",
        "Follow back",
        "Site Visit Scheduled / Done",
        "Negotiation / Booking in Progress",
        "Closed - Won",
        "Closed - Lost",
        "Other",
      ],
      default: "New / Fresh Lead",
    },
    notes: { type: String },
    visitDate: { type: Date },
  },
  { timestamps: true }
);

const ClientLead = mongoose.model("ClientLead", ClientLeadSchema);
export default ClientLead;
