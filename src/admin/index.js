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
const canDelete = (currentAdmin) => currentAdmin?.email === "admin@gmail.com";
const adminEmail = "admin@gmail.com";

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
        properties: {
//          isDisabled: ({ currentAdmin }) => {
//   console.log("currentAdmin:", currentAdmin); // debug
//   if (!currentAdmin) return true; // disable if not logged in
//   return currentAdmin.email !== adminEmail;
// },
//           email: {
//             isDisabled: ({ currentAdmin }) =>
//               currentAdmin?.email !== adminEmail,
//           },
//           phone: {
//             isDisabled: ({ currentAdmin }) =>
//               currentAdmin?.email !== adminEmail,
//           },
//           source: {
//             isDisabled: ({ currentAdmin }) =>
//               currentAdmin?.email !== adminEmail,
//           },
        },
        listProperties: [
          "name",
          "email",
          "phone",
          "project",
          "status",
          "visitDate",
          "source",
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
          "source",
        ],
        showProperties: [
          "name",
          "email",
          "phone",
          "status",
          "message",
          "visitDate",
          "notes",
          "project",
          "createdAt",
          "updatedAt",
          "source",
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
          },
          edit: {
            isAccessible: ({ currentAdmin }) => !!currentAdmin, // everyone logged-in can see edit
            before: async (request, context) => {
              console.log("context.currentAdmin.email",context.currentAdmin.email)
              console.log("adminEmail",adminEmail)
              if (context.currentAdmin.email !== adminEmail) {
                const restricted = ["name", "email", "phone", "source"];
                restricted.forEach((field) => delete request.payload?.[field]);
              }
              return request;
            },
          },
          delete: {
            isAccessible: ({ currentAdmin }) => canDelete(currentAdmin), // only admin can see
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
