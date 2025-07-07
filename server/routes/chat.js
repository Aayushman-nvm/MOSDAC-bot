import express from "express";
import { loadAllMosdacData } from "../utils/loadData.js";
import { getRelevantMosdacContent } from "../utils/queryHandler.js";
import { askGemini } from "../utils/geminiClient.js";

const router = express.Router();

const mosdacDataStore = loadAllMosdacData();

router.post("/mosdac", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log("MOSDAC DATA STORE: ", mosdacDataStore);
    const relevantContent = getRelevantMosdacContent(
      userMessage,
      mosdacDataStore
    );
    console.log("RELEVANT CONTENT: ", relevantContent);

    let prompt;
    if (relevantContent) {
      prompt = `You are a concise ISRO MOSDAC assistant.
      User's question: ${userMessage}
      Below is ISRO MOSDAC official data related to the query:
      ${relevantContent}
      Instructions:
      - Answer clearly using the above data.
      - Keep the answer concise (max 1-2 short paragraphs).
      - Do not provide overly detailed explanations.
      - Avoid repetition.
      - Use a friendly, conversational tone.
      - If unsure, state so briefly.`;
    } else {
      prompt = `User's question: ${userMessage}
      No direct MOSDAC dataset was found for this query. Please answer to the best of your knowledge, letting the user know data may be limited.`;
    }
    console.log("PROMPT: ", prompt);
    const geminiResponse = await askGemini(prompt);

    res.json({ answer: geminiResponse });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

export default router;
