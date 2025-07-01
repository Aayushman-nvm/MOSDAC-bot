import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API,
});

export async function askGemini(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompt}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini error:", error);
    return "Sorry, there was an error fetching the response from Gemini.";
  }
}
