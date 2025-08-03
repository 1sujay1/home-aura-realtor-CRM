// Secures AdminJS UI using auth logic
import AdminJSExpress from "@adminjs/express";
import dotenv from "dotenv";

dotenv.config();

const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL || "admin@example.com",
  password: process.env.ADMIN_PASSWORD || "admin123",
};

export const buildAdminRouter = (admin) => {
  const router = AdminJSExpress.buildAuthenticatedRouter(admin, {
    authenticate: async (email, password) => {
      if (
        email === DEFAULT_ADMIN.email &&
        password === DEFAULT_ADMIN.password
      ) {
        return DEFAULT_ADMIN;
      }
      return null;
    },
    cookieName: "adminjs",
    cookiePassword: process.env.COOKIE_SECRET || "sessionsecret",
  });

  return router;
};
