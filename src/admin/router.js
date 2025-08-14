// Secures AdminJS UI using auth logic
import AdminJSExpress from "@adminjs/express";
import dotenv from "dotenv";

dotenv.config();

const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

export const buildAdminRouter = (admin) => {
  const router = AdminJSExpress.buildAuthenticatedRouter(admin, {
    authenticate: async (email, password) => {
      // if (
      //   (email === DEFAULT_ADMIN.email || email === "staff@gmail.com") &&
      //   (password === DEFAULT_ADMIN.password || password === "1234")
      // ) {
      //   // return DEFAULT_ADMIN;
      //   return {
      //     email,
      //     password,
      //   };
      // }
      if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
  return { email:DEFAULT_ADMIN.email, role: "admin" };
} else if (email === "staff@gmail.com" && password === "1234") {
  return { email, role: "staff" };
}
      return null;
    },
    cookieName: "adminjs",
    cookiePassword: process.env.COOKIE_SECRET || "sessionsecret",
  });

  return router;
};
