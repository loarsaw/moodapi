import express, { Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
import routes from "./routes";
dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(routes()).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
