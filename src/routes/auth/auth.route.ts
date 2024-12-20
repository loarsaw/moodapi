import { Router } from "express";
import authController from "../../controllers/auth/auth.controller";

export default (router: Router) => {
  router.post("/sign-up", authController.register);
  router.post("/sign-in", authController.login);
  router.post("/verify-otp", authController.verify);
};
