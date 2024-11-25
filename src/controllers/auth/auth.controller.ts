import { Request, Response } from "express";
import { Singleton } from "../../lib/singleton";
import authService from "../../services/auth/auth.service";
import "dotenv/config";
@Singleton
class AuthController {
  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await authService.findUserByEmail({ email: email });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  public verify = async (req: Request, res: Response) => {
    const { token } = req.params;
    if (!token) {
      res.status(400).json({ message: "Token not provided" });
    }
    try {
      const isValid = false;
      if (isValid) {
        res.status(200).json({ message: "Token is valid" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  public register = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user_exists = await authService.findUserByEmail({ email: email });
      if (user_exists == null) {
      } else {
        res.status(201).json({
          success: false,
          msg: "A user already exists with this email",
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
export default new AuthController();
