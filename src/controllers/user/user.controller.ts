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
      console.log(user_data);
      res.status(200).json({ userData: user_data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  public updateUserData = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      console.log(data);

      const updated_data = await databaseService.update_document(
        data.uid,
        data.fullName,
        "techno_user",
        "_id",
        "name"
      );
      console.log(updated_data);
      res.status(200).json({ message: "Name Updated" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
export default new UserController();
