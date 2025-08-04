// Generates AdminJS config & resources
import AdminJS, { ComponentLoader, Login } from "adminjs";
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
