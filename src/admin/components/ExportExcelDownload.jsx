import { useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const ExportExcelDownload = () => {
  useEffect(() => {
    const fetchAndDownload = async () => {
      const url = new URL(window.location.href);
      const searchParams = url.searchParams;

      const params = {};
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }

      try {
        const response = await axios.get(
          "/admin/api/resources/Leads/actions/list",
          {
            params,
            withCredentials: true, // important to keep admin session
          }
        );

        const records = response?.data?.records || [];

        const formatted = records.map((r) => ({
          Name: r.params.name,
          Email: r.params.email,
          Phone: r.params.phone,
          Status: r.params.status,
          Source: r.params.source,
          Notes: r.params.notes,
          Message: r.params.message,
          Project: r.params.project,
          CreatedAt: r.params.createdAt?.split("T")[0],
          VisitDate: r.params.visitDate
            ? new Date(r.params.visitDate).toISOString().split("T")[0]
            : "",
        }));

        const worksheet = XLSX.utils.json_to_sheet(formatted);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "FilteredLeads");

        const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([wbout], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "filtered-leads.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("❌ Failed to fetch filtered data:", error);
      }
    };

    fetchAndDownload();
  }, []);

  return <p>Exporting filtered leads...</p>;
};

export default ExportExcelDownload;
