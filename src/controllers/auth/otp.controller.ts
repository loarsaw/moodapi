import { Request, Response } from "express";
import { Singleton } from "../../lib/singleton";
import "dotenv/config";
import otpGenerator from "otp-generator";
import { sendOtpMail } from "../../services/email/opt.service";

@Singleton
class OTPController {
  public sentOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    try {
      await sendOtpMail(email, otp);
      res.status(500).json({ message: "OTP Sent" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  public verifyOtp = async (req: Request, res: Response) => {
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
}
export default new OTPController();
