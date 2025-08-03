import express from "express";
import multer from "multer";
import fs from "fs/promises";
import XLSX from "xlsx";
import Lead from "../models/Lead.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/import-leads", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "File is required" });
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
    const existingLeads = await Lead.find({
      $or: [
        { email: { $in: leads.map((l) => l.email) } },
        { phone: { $in: leads.map((l) => l.phone) } },
      ],
    });

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

    const inserted = await Lead.insertMany(newLeads);
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
