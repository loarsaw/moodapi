import { Router } from "express";
import authRoute from "./auth/auth.route";
const router = Router();
export default (): Router => {
  authRoute(router);
  return router;
};
