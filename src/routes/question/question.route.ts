import { Router } from "express";
import questionsController from "../../controllers/questions/questions.controller";

export default (router: Router) => {
  router.post("/get-questions", questionsController.getQuestions);
};
