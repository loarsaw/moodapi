import { Request, Response } from "express";
import { Singleton } from "../../lib/singleton";
import authService from "../../services/auth/auth.service";
import "dotenv/config";
import otpGenerator from "otp-generator";
import { sendOtpMail } from "../../services/email/opt.service";
import databaseService from "../../services/database/database.service";
import { EMAIL, EMAIL_LOGS, USERS } from "../../lib/constants";
import jwt from "jsonwebtoken";
@Singleton
class AuthController {
  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await authService.findUserByEmail({ email: email });
      if (user) {
        if (user.password == password) {
          const accessToken = jwt.sign(
            { uid: user._id },
            process.env.JWT_SECRET ?? "akjsja89",
            {
              expiresIn: "3d",
            }
          );
          const refreshToken = jwt.sign(
            { uid: user._id },
            process.env.JWT_SECRET ?? "akjsja89",
            {
              expiresIn: "7d",
            }
          );
          res
            .status(200)
            .json({ accessToken: accessToken, refreshToken: refreshToken });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  public verify = async (req: Request, res: Response) => {
    const { token, email } = req.body;
    if (!token) {
      res.status(400).json({ message: "Token not provided" });
    }
    try {
      const user = await databaseService.get_single_document(
        email,
        USERS,
        EMAIL
      );
      if (user && user.otp == token) {
        const accessToken = jwt.sign(
          { uid: user._id },
          process.env.JWT_SECRET ?? "akjsja89",
          {
            expiresIn: "3d",
          }
        );
        const refreshToken = jwt.sign(
          { uid: user._id },
          process.env.JWT_SECRET ?? "akjsja89",
          {
            expiresIn: "7d",
          }
        );
        console.log(token, refreshToken);
        res
          .status(200)
          .json({ token: accessToken, refreshToken: refreshToken });
      } else {
        res.status(400).json({ message: "Cannot verify" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  public register = async (req: Request, res: Response) => {
    try {
      console.log("Ot");
      const { email, password } = req.body;
      const otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      await databaseService.insert_document(
        {
          email,
          // password has to be hashed and ideally we will store it
          // in  a separate document but for sake of brevity am storing
          // it in same without any hashes
          password: password,
          createdAt: new Date(),
          email_verified: false,
          otp: otp,
        },
        USERS
      );
      const data = await sendOtpMail(email, otp);
      res.status(200).json("OTP SENT");
      await databaseService.insert_document(data, EMAIL_LOGS);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
export default new AuthController();
