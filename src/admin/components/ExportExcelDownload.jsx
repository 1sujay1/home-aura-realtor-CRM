import { useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
// ✅ Define mapping per resource ID (skip _id, __v, mailStatus)
const resourceMappings = {
  Leads: (r) => ({
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
  }),

  "Client-Leads": (r) => ({
    Name: r.params.name,
    Email: r.params.email,
    Phone: r.params.phone,
    "Secondary Phone": r.params.secondaryPhone,
    Source: r.params.source,
    Message: r.params.message,
    Project: r.params.project,
    Status: r.params.status,
    Notes: r.params.notes,
    "Visit Date": r.params.visitDate
      ? new Date(r.params.visitDate).toISOString().split("T")[0]
      : "",
    "Created At": r.params.createdAt?.split("T")[0],
  }),

  "Property-Owners": (r) => ({
    Name: r.params.name,
    Phone: r.params.phone,
    Email: r.params.email,
    Parking: r.params.parking,
    Security: r.params.security,
    Flat: r.params.flat,
    Rent: r.params.rent,
    Advance: r.params.advance,
    Source: r.params.source,
    Availability: r.params.availability,
    Notes: r.params.notes,
    Location: r.params.location,
    Status: r.params.status,
    "Created At": r.params.createdAt?.split("T")[0],
  }),

  "Tenant-Leads": (r) => ({
    Name: r.params.name,
    Email: r.params.email,
    Phone: r.params.phone,
    Budget: r.params.budget,
    Location: r.params.location,
    "Tenant Type": r.params.tenantType,
    Source: r.params.source,
    Availability: r.params.availability,
    Notes: r.params.notes,
    Flat: r.params.flat,
    Status: r.params.status,
    "Created At": r.params.createdAt?.split("T")[0],
  }),
};
const ExportExcelDownload = (props) => {
  console.log("📦 ExportExcelDownload props:", props);

  useEffect(() => {
    const resourceId = props?.resource?.id;
    if (!resourceId) return;

    const fetchAndDownload = async () => {
      const url = new URL(window.location.href);
      const searchParams = url.searchParams;

      // ✅ collect filter params from AdminJS page
      const params = {};
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }

      try {
        // ✅ fetch filtered records for this resource
        const response = await axios.get(
          `/admin/api/resources/${props?.resource?.id}/actions/list`,
          {
            params,
            withCredentials: true, // important: preserves admin session cookies
          }
        );

        const records = response?.data?.records || [];
        if (!records.length) {
          alert("No records found to export!");
          return;
        }
        // const formatted = records.map((r) => ({
        //   Name: r.params.name,
        //   Email: r.params.email,
        //   Phone: r.params.phone,
        //   Status: r.params.status,
        //   Source: r.params.source,
        //   Notes: r.params.notes,
        //   Message: r.params.message,
        //   Project: r.params.project,
        //   CreatedAt: r.params.createdAt?.split("T")[0],
        //   VisitDate: r.params.visitDate
        //     ? new Date(r.params.visitDate).toISOString().split("T")[0]
        //     : "",
        // }));
        const mapFn = resourceMappings[resourceId] || resourceMappings["Leads"];
        const formatted = records.map(mapFn);
        // ✅ STEP 3: Convert to Excel
        const worksheet = XLSX.utils.json_to_sheet(formatted);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Exported Data");

        const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([wbout], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // ✅ STEP 4: Trigger file download
        const resourceName = props?.resource?.name || "data";
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${resourceName}-export-${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("❌ Failed to export:", error);
        alert("Export failed. Please check console for details.");
      }
    };

    fetchAndDownload();
  }, []);

  return (
    <p style={{ padding: "1rem", fontSize: "16px" }}>
      ⏳ Preparing your Excel file...
    </p>
  );
};

export default ExportExcelDownload;
