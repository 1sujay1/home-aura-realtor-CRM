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
      enum: ["New", "Contacted", "Visited", "Purchased", "Cancelled"],
      default: "New",
    },
    notes: { type: String },
    visitDate: { type: Date },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", LeadSchema);
export default Lead;
