// Generates AdminJS config & resources
import AdminJS, { ComponentLoader } from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import Lead from "../models/Lead.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// import CustomLogin from "./components/CustomLogin";

// Initialize component loader
const componentLoader = new ComponentLoader();
// Register your component
const Components = {
  Dashboard: componentLoader.add("Dashboard", "./components/Dashboard"),
  Login: componentLoader.override("Login", "./components/Login"),
  ExcelUploadComponent: componentLoader.add(
    "ExcelUploadComponent",
    "./components/ExcelUploadComponent"
  ),
  ExportExcelDownload: componentLoader.add(
    "ExportExcelDownload",
    "./components/ExportExcelDownload"
  ),
  // other custom components
};

AdminJS.registerAdapter(AdminJSMongoose);
const adminOptions = {
  resources: [
    {
      resource: Lead,
      options: {
        id: "Leads",
        navigation: {
          name: "CRM Data", // 👈 Custom group name shown in sidebar
          icon: "User", // 👈 Optional icon from AdminJS icons
        },
        listProperties: [
          "name",
          "email",
          "phone",
          "project",
          "status",
          "visitDate",
        ],
        editProperties: [
          "name",
          "email",
          "phone",
          "status",
          "visitDate",
          "notes",
          "project",
        ],
        filterProperties: [
          "name",
          "email",
          "phone",
          "status",
          "visitDate",
          "project",
        ],
        showProperties: [
          "name",
          "email",
          "phone",
          "status",
          "visitDate",
          "notes",
          "project",
        ],
        sort: {
          sortBy: "visitDate",
          direction: "desc",
        },
        actions: {
          importExcel: {
            label: "Import from Excel",
            icon: "Upload",
            actionType: "resource",
            component: Components.ExcelUploadComponent,
            isVisible: true,
          },
          exportLeads: {
            actionType: "resource",
            icon: "Download",
            label: "Export to Excel",
            showInDrawer: true,
            component: Components.ExportExcelDownload, // frontend component will be added later
            isVisible: true,
            // handler: async (request, response, context) => {
            //   // console.log("request:", request);
            //   // console.log("context:", context);
            //   console.log("request.query:", request.query);
            //   console.log("request.params:", request.params);
            //   console.log("request.body:", request.body);
            //   const filter = request?.query?.filters || {};
            //   console.log("🔎 Received Filters:", filter);

            //   const query = {};

            //   // Apply filters dynamically
            //   if (filter.name) query.name = filter.name;
            //   if (filter.email) query.email = filter.email;
            //   if (filter.status) query.status = filter.status;
            //   const leads = await Lead.find(query).lean();

            //   const formatted = leads.map((lead) => ({
            //     Name: lead.name,
            //     Email: lead.email,
            //     Phone: lead.phone,
            //     Status: lead.status,
            //     CreatedAt: lead.createdAt?.toISOString()?.split("T")[0],
            //   }));

            //   const sheet = XLSX.utils.json_to_sheet(formatted);
            //   const workbook = XLSX.utils.book_new();
            //   XLSX.utils.book_append_sheet(workbook, sheet, "Leads");

            //   const buffer = XLSX.write(workbook, {
            //     bookType: "xlsx",
            //     type: "buffer",
            //   });
            //   const base64 = buffer.toString("base64");

            //   return {
            //     data: {
            //       base64,
            //       filename: "leads.xlsx",
            //     },
            //   };
            // },
          },

          // myCustomAction: {
          //   actionType: "record",
          //   isVisible: true,
          //   icon: "Download",
          //   component: false, // see "Writing your own Components"
          //   handler: (request, response, context) => {
          //     const { record, currentAdmin } = context;
          //     return {
          //       record: record.toJSON(currentAdmin),
          //     };
          //   },
          //   showInDrawer: true,
          // },
        },
      },
    },
  ],
  rootPath: "/admin",
  branding: {
    companyName: "RealEstate CRM",
    softwareBrothers: false,
    logo: false,
  },
  assets: {
    styles: ["./admin.css"], // 👈 Make sure this path matches your setup
  },
  dashboard: {
    component: Components.Dashboard,
  },
  login: {
    component: Components.Login,
  },
  componentLoader,
};

const admin = new AdminJS(adminOptions);

export default admin;
