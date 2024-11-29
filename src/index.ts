import express, { json, Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes";
dotenv.config();
const app = express();
app.use(cors());
app.use(json());
const PORT = process.env.PORT;

app.use(routes()).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
