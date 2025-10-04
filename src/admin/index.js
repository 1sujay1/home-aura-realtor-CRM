// Generates AdminJS config & resources
import AdminJS, { ComponentLoader } from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import Lead from "../models/Lead.js";
import ClientLead from "../models/ClientLeads.js";
import { fileURLToPath } from "url";
import path from "path";
import RentLead from "../models/RentLead.js";
import ExpenseEntry from "../models/ExpenseEntry.js";

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
const adminEmail = "admin@gmail.com";
const onlyAdmin = (currentAdmin) => currentAdmin?.email === adminEmail;

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
          "createdAt",
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
          "secondaryPhone",
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
          "secondaryPhone",
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
              console.log(
                "context.currentAdmin.email",
                context.currentAdmin.email
              );
              console.log("adminEmail", adminEmail);
              if (context.currentAdmin.email !== adminEmail) {
                const restricted = ["name", "email", "phone", "source"];
                restricted.forEach((field) => delete request.payload?.[field]);
              }
              return request;
            },
          },
          delete: {
            isAccessible: ({ currentAdmin }) => onlyAdmin(currentAdmin), // only admin can see
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
    {
      resource: ClientLead,
      options: {
        id: "Client Leads",
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
          "createdAt",
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
          "secondaryPhone",
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
          "secondaryPhone",
        ],
        sort: {
          sortBy: "visitDate",
          direction: "desc",
        },
        actions: {
          edit: {
            isAccessible: ({ currentAdmin }) => !!currentAdmin, // everyone logged-in can see edit
            before: async (request, context) => {
              console.log(
                "context.currentAdmin.email",
                context.currentAdmin.email
              );
              console.log("adminEmail", adminEmail);
              if (context.currentAdmin.email !== adminEmail) {
                const restricted = ["name", "email", "phone", "source"];
                restricted.forEach((field) => delete request.payload?.[field]);
              }
              return request;
            },
          },
          delete: {
            isAccessible: ({ currentAdmin }) => onlyAdmin(currentAdmin), // only admin can see
          },
          // list: {
          //   isAccessible: ({ currentAdmin }) => onlyAdmin(currentAdmin), // only admin can see
          // },
          // show: {
          //   isAccessible: ({ currentAdmin }) => onlyAdmin(currentAdmin), // only admin can see
          // },
          // new: {
          //   isAccessible: ({ currentAdmin }) => onlyAdmin(currentAdmin), // only admin can see
          // },

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
        // isVisible: ({ currentAdmin }) =>
        //   currentAdmin && currentAdmin.role === "admin",
      },
    },
    {
      resource: RentLead,
      options: {
        id: "Rent Leads",
        navigation: {
          name: "CRM Data", // 👈 Custom group name shown in sidebar
          icon: "User", // 👈 Optional icon from AdminJS icons
        },
        listProperties: [
          "flat",
          "rent",
          "advance",
          "location",
          "availability",
          "notes",
        ],
        editProperties: [
          "ownerName",
          "ownerPhone",
          "flat",
          "rent",
          "advance",
          "location",
          "parking",
          "security",
          "availability",
          "notes",
        ],
        filterProperties: ["flat", "location", "rent"],
        showProperties: [
          "ownerName",
          "ownerPhone",
          "flat",
          "rent",
          "advance",
          "location",
          "parking",
          "security",
          "source",
          "availability",
          "notes",
          "createdAt",
          "updatedAt",
        ],
        sort: {
          sortBy: "createdAt",
          direction: "desc",
        },
        actions: {
          // edit: {
          //   isAccessible: ({ currentAdmin }) => onlyAdmin(currentAdmin), // only admin can do
          // },
          delete: {
            isAccessible: ({ currentAdmin }) => onlyAdmin(currentAdmin), // only admin can do
          },
          // list: {
          //   isAccessible: ({ currentAdmin }) => onlyAdmin(currentAdmin), // only admin can do
          // },
          // show: {
          //   isAccessible: ({ currentAdmin }) => onlyAdmin(currentAdmin), // only admin can do
          // },
          new: {
            isAccessible: ({ currentAdmin }) => onlyAdmin(currentAdmin), // only admin can do
          },
        },
      },
    },
    {
      resource: ExpenseEntry,
      options: {
        id: "Expense Entries",
        navigation: {
          name: "Admin Section", // 👈 Custom group name shown in sidebar
          icon: "User", // 👈 Optional icon from AdminJS icons
        },
        listProperties: [
          "category",
          "description",
          "amount",
          "date",
          "paymentMode",
        ],
        editProperties: [
          "category",
          "description",
          "amount",
          "date",
          "paymentMode",
          "paymentMadeBy",
          "expenseType",
          "notes",
        ],
        filterProperties: [
          "paymentMadeBy",
          "paymentMode",
          "expenseType",
          "amount",
          "date",
          "category",
        ],
        showProperties: [
          "category",
          "description",
          "amount",
          "date",
          "paymentMode",
          "paymentMadeBy",
          "expenseType",
          "notes",
          "createdAt",
          "updatedAt",
        ],
        sort: {
          sortBy: "createdAt",
          direction: "desc",
        },
        actions: {
          edit: {
            isAccessible: ({ currentAdmin }) => onlyAdmin(currentAdmin), // only admin can do
          },
          delete: {
            isAccessible: ({ currentAdmin }) => onlyAdmin(currentAdmin), // only admin can do
          },
          list: {
            isAccessible: ({ currentAdmin }) => onlyAdmin(currentAdmin), // only admin can do
          },
          show: {
            isAccessible: ({ currentAdmin }) => onlyAdmin(currentAdmin), // only admin can do
          },
          new: {
            isAccessible: ({ currentAdmin }) => onlyAdmin(currentAdmin), // only admin can do
          },
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
