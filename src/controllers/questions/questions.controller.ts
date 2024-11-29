import { Request, Response } from "express";
import { Singleton } from "../../lib/singleton";
import "dotenv/config";
import databaseService from "../../services/database/database.service";
import { ObjectId } from "mongodb";

@Singleton
class QuestionsController {
  public getQuestions = async (req: Request, res: Response) => {
    try {
      const { already_completed } = req.body;
      console.log(already_completed, "jsakj");
      const excludes = already_completed.map((id: string) => new ObjectId(id));
      const data = await databaseService.get_documents_except(excludes);
      res.status(200).json({ message: "A set of 5 question", questions: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
export default new QuestionsController();
