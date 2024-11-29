import { Router } from "express";
import userController from "../../controllers/user/user.controller";
import verifyAuth from "../../middleware/auth.middleware";

export default (router: Router) => {
  router.get("/get-user", verifyAuth, userController.getUserData);
};
