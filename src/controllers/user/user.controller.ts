import { Request, Response } from "express";
import { Singleton } from "../../lib/singleton";
import "dotenv/config";
import databaseService from "../../services/database/database.service";
import { USERS } from "../../lib/constants";
import { ObjectId } from "mongodb";
@Singleton
class UserController {
  public getUserData = async (req: Request, res: Response) => {
    try {
      const { uid } = req.body;
      const id = new ObjectId(uid);
      const user_data = await databaseService.get_single_document(
        id,
        USERS,
        "_id"
      );
      res.status(200).json({ userData: user_data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
export default new UserController();
