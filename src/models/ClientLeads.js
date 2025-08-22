// Mongoose schema for leads (Lead)
import mongoose from "mongoose";

const ClientLeadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    source: {
      type: String,
      enum: ["PORTAL"],
      default: "PORTAL",
    }, // Default source
    mailStatus: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    }, // Status of the contact mail
    message: { type: String },
    project: { type: String },
  },
  { timestamps: true }
);

const ClientLead = mongoose.model("ClientLead", ClientLeadSchema);
export default ClientLead;
