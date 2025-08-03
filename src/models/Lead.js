// Mongoose schema for leads (Lead)
import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    message: { type: String },
    status: {
      type: String,
      enum: [
        "New / Fresh Lead",
        "Contacted / Attempted to Contact",
        "Interested / Warm Lead",
        "Not Interested",
        "Follow-Up Scheduled",
        "Site Visit Scheduled / Done",
        "Negotiation / Booking in Progress",
        "Closed - Won",
        "Closed - Lost",
      ],
      default: "New",
    },
    notes: { type: String },
    visitDate: { type: Date },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", LeadSchema);
export default Lead;
