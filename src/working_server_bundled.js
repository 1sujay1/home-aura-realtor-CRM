import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import admin from "./admin/index.js"; // your AdminJS config object
import path from "path";
import { fileURLToPath } from "url";
import { bundle } from "@adminjs/bundler";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use(bundle(admin));
// Session middleware (important!)
app.use(
  session({
    secret: "super-secret-key", // 🔐 Replace with a secure value in production
    resave: false,
    saveUninitialized: false,
  })
);

// MongoDB connection
const start = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // await bundle(admin);

  // AdminJS setup
  const adminRouter = AdminJSExpress.buildRouter(admin);
  app.use(
    admin.options.rootPath,
    (req, res, next) => {
      if (req.session && req.session.adminUser) {
        next();
      } else {
        res.redirect("/auth/login");
      }
    },
    adminRouter
  );

  // Home redirect
  app.get("/", (req, res) => res.redirect("/admin"));

  // ✅ Custom Login Page
  app.get("/auth/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "auth-login.html"));
  });

  app.post("/auth/login", (req, res) => {
    const { email, password } = req.body;

    // TODO: Replace with DB-based check
    if (
      email === "admin" ||
      (email === "admin@gmail.com" && password === "1234")
    ) {
      req.session.adminUser = { email };
      return res.redirect("/admin");
    }

    // Graceful redirect with encoded error message
    const errorMessage = encodeURIComponent("Invalid username or password.");
    res.redirect(`/auth/login?error=${errorMessage}`);
  });

  // AdminJS default logout link
  app.get("/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/auth/login");
    });
  });

  // Your custom logout page (if used elsewhere)
  app.get("/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/auth/login");
    });
  });

  // Customer dashboard placeholder
  app.get("/dashboard", (req, res) => {
    res.send("Customer Dashboard - CRM features coming soon!");
  });

  const PORT = process.env.PORT || 3000;
  const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
  app.listen(PORT, () => {
    console.log(`✅ Server running at ${BACKEND_URL}${admin.options.rootPath}`);
  });
};

start();
