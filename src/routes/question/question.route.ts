import { Router } from "express";
import questionsController from "../../controllers/auth/questions.controller";

export default (router: Router) => {
  router.post("/get-questions", questionsController.getQuestions);
};
