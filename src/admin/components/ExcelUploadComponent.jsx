import React, { useState } from "react";
import {
  Box,
  Button,
  H2,
  Loader,
  Label,
  Input,
  Text,
  MessageBox,
  Badge,
} from "@adminjs/design-system";

const ExcelUploadComponent = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [duplicates, setDuplicates] = useState([]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setMessage("");
    setDuplicates([]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("/admin-actions/import-leads", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        let msg = `✅ ${result.insertedCount} leads imported.\n⛔ ${result.skippedCount} skipped due to duplicates in DB.`;

        if (result.skippedEntries?.length > 0) {
          msg += `\n\nSkipped Entries:\n${result.skippedEntries
            .map(
              (entry) =>
                `Row ${entry.row}: ${entry.name} (${entry.email}, ${entry.phone}) — ${entry.reason}`
            )
            .join("\n")}`;
        }

        setMessage(msg);
        setFile(null); // reset file input
      } else {
        let duplicateDetails = "";
        if (result.duplicateEmails?.length > 0) {
          duplicateDetails += `\nDuplicate Emails: ${result.duplicateEmails.join(
            ", "
          )}`;
        }
        if (result.duplicatePhones?.length > 0) {
          duplicateDetails += `\nDuplicate Phones: ${result.duplicatePhones.join(
            ", "
          )}`;
        }

        setMessage(`❌ Error: ${result.error}${duplicateDetails}`);
      }
    } catch (err) {
      setMessage(`❌ Upload failed: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <Box variant="grey" p="xl" width="100%" maxWidth="600px" mx="auto" mt="xxl">
      <H2 mb="xl">📥 Import Leads via Excel</H2>

      <Box mb="lg">
        <Label>Choose Excel File (.xlsx)</Label>
        <Input type="file" accept=".xlsx" onChange={handleFileChange} />
        {file && (
          <Text mt="sm" color="grey60" fontSize="sm">
            Selected file: <strong>{file.name}</strong>
          </Text>
        )}
      </Box>

      <Button
        variant="primary"
        onClick={handleUpload}
        disabled={loading || !file}
      >
        Upload
      </Button>

      {loading && <Loader mt="xl" />}

      {message && (
        <MessageBox
          mt="xl"
          variant={message.startsWith("✅") ? "success" : "danger"}
        >
          {message}
        </MessageBox>
      )}

      {duplicates.length > 0 && (
        <Box mt="xl">
          <H2 fontSize="lg" mb="md">
            ⚠️ Skipped Duplicates
          </H2>
          {duplicates.map((dup, idx) => (
            <Box key={idx} mb="xs">
              <Badge variant="danger">
                {dup.email || "No Email"} / {dup.phone || "No Phone"}
              </Badge>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ExcelUploadComponent;
