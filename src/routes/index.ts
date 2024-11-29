import { Router } from "express";
import authRoute from "./auth/auth.route";
import questionRoute from "./question/question.route";
const router = Router();
export default (): Router => {
  authRoute(router);
  questionRoute(router);
  return router;
};
