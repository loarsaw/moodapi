import { Router } from "express";
import authRoute from "./auth/auth.route";
import questionRoute from "./question/question.route";
import userRoute from "./user/user.route";
const router = Router();
export default (): Router => {
  authRoute(router);
  questionRoute(router);
  userRoute(router);
  return router;
};
