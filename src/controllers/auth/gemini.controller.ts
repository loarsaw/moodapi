import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { Request, Response } from "express";
import "dotenv/config";
import database_service from "../../services/database/database.service";
import { DB_THEORY } from "../../lib/constants";
import { v4 as uuid } from "uuid";
import { Singleton } from "../../lib/singleton";
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

@Singleton
class AI_AGENT_CONTROLLER {
  private config;
  private model;
  private chat;
  constructor() {
    this.config = new GoogleGenerativeAI(process.env?.GEMINI_API_KEY ?? "");
    this.model = this.config.getGenerativeModel({
      model: "gemini-1.0-pro-latest",
      safetySettings: safetySettings,
    });
    this.chat = this.model.startChat({
      history: [
        { role: "user", parts: [{ text: "Hello" }] },
        {
          role: "model",
          parts: [{ text: "Hi, how can I help you today?" }],
        },
      ],
    });
  }

  public getString = async (req: Request, res: Response) => {
    const { msg } = req.body;
    const message = `Generate a response explaining in details what ${msg} is`;
    const code_message = `generate a detailed code for topic ${msg} only code not explanation in markdown format`;
    const keyword_message =
      "give me an array of string that has keywords related to the topic in format []";
    const links_message = `generate a list of links related to the topic ${msg} in an array format  ie.[]`;
    const response = await this.chat.sendMessage(message);
    const code_res = await this.chat.sendMessage(code_message);
    const keywords = await this.chat.sendMessage(keyword_message);
    const links_response = await this.chat.sendMessage(links_message);
    const gemini_response = response.response.text();
    const code_response = code_res.response.text();
    const keyword_response = keywords.response.text();
    const key_words = JSON.parse(keyword_response?.replace(/```/g, ""));
    const links = JSON.parse(
      links_response.response.text()?.replace(/```/g, "")
    );

    const uid = uuid();
    await database_service.insert_document(
      {
        uid,
        description: gemini_response,
        code: code_response,
        keywords: key_words,
        links: links,
      },
      DB_THEORY
    );

    res.json({
      // msg: {
      uid,
      description: gemini_response,
      code: code_response,
      keywords: key_words,
      links: links,
      // },
    });
  };

  public getTopics = async (req: Request, res: Response) => {
    const topics_data = await database_service.get_all_documents_of_collection(
      DB_THEORY
    );
    res.json({ topics: topics_data });
  };

  // public getSingleTopic = async (req: Request, res: Response) => {
  //   const { name_string } = req.params;
  //   const topic_data = await database_service.get_single_document(
  //     name_string,
  //     DB_THEORY
  //   );
  //   res.json({ topic: topic_data });
  // };
}

export default new AI_AGENT_CONTROLLER();
