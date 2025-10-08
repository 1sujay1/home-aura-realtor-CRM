import express from "express";
import multer from "multer";
import fs from "fs/promises";
import XLSX from "xlsx";
import Lead from "../models/Lead.js";
import ClientLead from "../models/ClientLeads.js";
import PropertyOwnerLead from "../models/PropertyOwnerLead.js";
import TenantLead from "../models/TenantLead.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/import-leads", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "File is required" });
    }
    const resourceId = req.query.resourceId || "Leads";
    console.log("Importing leads for resource:", resourceId);

    // Map resourceId values to Mongoose models
    const resourceMap = {
      Leads: Lead,
      "Client-Leads": ClientLead,
      "Property-Owners": PropertyOwnerLead,
      "Tenant-Leads": TenantLead,
    };

    const Model = resourceMap[resourceId];
    if (!Model) {
      await fs.unlink(req.file.path).catch(() => {});
      return res
        .status(400)
        .json({ success: false, error: `Unknown resourceId: ${resourceId}` });
    }
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // Normalize data
    const leads = rows
      .map((row, index) => {
        const normalizedRow = {};
        Object.keys(row).forEach((key) => {
          normalizedRow[key.toLowerCase()] = row[key];
        });
        return {
          rowIndex: index + 2, // +2 to account for header row and 0-indexing
          name: normalizedRow.name?.toString().trim(),
          email: normalizedRow.email?.toString().trim().toLowerCase(),
          phone: (normalizedRow.mobile ?? normalizedRow.phone)
            ?.toString()
            .trim(),
        };
      })
      .filter((l) => l.email && l.phone);

    // ✅ Check for duplicates in the uploaded Excel file
    const seenEmails = new Set();
    const seenPhones = new Set();
    const duplicateEmailsInExcel = new Set();
    const duplicatePhonesInExcel = new Set();

    for (const lead of leads) {
      if (seenEmails.has(lead.email)) {
        duplicateEmailsInExcel.add(lead.email);
      } else {
        seenEmails.add(lead.email);
      }

      if (seenPhones.has(lead.phone)) {
        duplicatePhonesInExcel.add(lead.phone);
      } else {
        seenPhones.add(lead.phone);
      }
    }

    if (duplicateEmailsInExcel.size || duplicatePhonesInExcel.size) {
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: "Duplicate entries found in the uploaded Excel file.",
        duplicateEmails: [...duplicateEmailsInExcel],
        duplicatePhones: [...duplicatePhonesInExcel],
      });
    }

    // ✅ Check for existing entries in the DB
    // Use the selected model to check for existing entries
    const existingQuery = { $or: [] };
    const emails = leads.map((l) => l.email).filter(Boolean);
    const phones = leads.map((l) => l.phone).filter(Boolean);
    if (emails.length) existingQuery.$or.push({ email: { $in: emails } });
    if (phones.length) existingQuery.$or.push({ phone: { $in: phones } });

    let existingLeads = [];
    if (existingQuery.$or.length) {
      existingLeads = await Model.find(existingQuery);
    }

    const existingEmailSet = new Set(existingLeads.map((l) => l.email));
    const existingPhoneSet = new Set(existingLeads.map((l) => l.phone));

    // ✅ Split leads into new and skipped (based on DB duplicates)
    const newLeads = [];
    const skippedLeads = [];

    for (const lead of leads) {
      if (
        existingEmailSet.has(lead.email) ||
        existingPhoneSet.has(lead.phone)
      ) {
        skippedLeads.push({
          row: lead.rowIndex,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          reason: `${existingEmailSet.has(lead.email) ? "Email" : ""} ${
            existingPhoneSet.has(lead.phone) ? "Phone" : ""
          } already exists`,
        });
      } else {
        newLeads.push(lead);
      }
    }

    // Insert using the selected model. Normalize fields to the model shape as needed.
    const inserted = await Model.insertMany(newLeads);
    await fs.unlink(req.file.path);

    res.json({
      success: true,
      message: `${inserted.length} leads imported. ${skippedLeads.length} skipped due to duplicates in DB.`,
      insertedCount: inserted.length,
      skippedCount: skippedLeads.length,
      skippedEntries: skippedLeads,
    });
  } catch (err) {
    console.error("Excel import error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
