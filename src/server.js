import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import admin from "./admin/index.js";
import { buildAdminRouter } from "./admin/router.js";
import dotenv from "dotenv";
import { bundle } from "@adminjs/bundler";
import adminRoutes from "./admin/admin.router.js";
import mainRouter from "./controller/routes/router.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
// app.use(express.static(path.join(__dirname, "public")));
// Attach main router for /api routes
app.use("/api/v1", mainRouter);
const start = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const adminRouter = buildAdminRouter(admin);
  app.use(admin.options.rootPath, adminRouter);

  app.get("/", (req, res) => res.redirect("/admin"));

  // Customer dashboard placeholder
  app.get("/dashboard", (req, res) => {
    res.send("Customer Dashboard - CRM features coming soon!");
  });

  // Routes
  app.use("/admin-actions", adminRoutes);

  const PORT = process.env.PORT || 3000;
  const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
  app.listen(PORT, () => {
    console.log(`✅ Server running at ${BACKEND_URL}${admin.options.rootPath}`);
  });
};

start();
