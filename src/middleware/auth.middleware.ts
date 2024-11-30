import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";

const verifyAuth = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET ?? "akjsja89", (err, decoded) => {
    if (err) {
      res.status(403).json({ error: "Invalid token." });
    }
    // console.log(decoded, "token");
    if (decoded && typeof decoded === "object") {
      req.body.uid = decoded.uid;
      console.log("verified");
      next();
    } else {
      return res.status(403).json({ error: "Token verification failed." });
    }
  });
};

export default verifyAuth;
