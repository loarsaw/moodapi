import { Router } from "express";
import authController from "../../controllers/auth/auth.controller";

export default (router: Router) => {
  router.post("/sign_up", authController.register);
  router.post("/login", authController.login);
};
