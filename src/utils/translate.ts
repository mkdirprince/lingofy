import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
config();

const apiKey = process.env.GEMINI_KEY;

if (!apiKey) {
  throw new Error("GEMINI_KEY env variable is not defined");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const translate = async (message: string, targetLang: string) => {
  const prompt = `translate "${message}" to the language "${targetLang}". No context needed, just translate and send ONLY the translated text`;

  const result = await model.generateContent(prompt);

  return result.response.text() || null;
};
