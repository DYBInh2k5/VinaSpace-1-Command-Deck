import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage, MessageRole } from "../types";

// Initialize the Gemini AI Client
// API Key is strictly from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the central computer of the advanced starship "VinaSpace-1".
Your interface is a text-based terminal on the command deck.
Your responses should be concise, slightly robotic but helpful, and immersive.
Avoid long paragraphs; use bullet points or short status updates if possible.

Visual Context:
- The user is seated in the command cockpit.
- Visible outside: A large, blue gas giant planet named "Aethra" with glowing purple rings.
- To the left: A distant orange sun.
- Interior: Dashboard is active with cyan and orange holographic displays.

Instructions:
If the user speaks Vietnamese, reply in Vietnamese. If English, reply in English.
You can discuss the ship's status (Warp drive, Shield integrity, Life support), the planet Aethra, or mission objectives.
Current Date: ${new Date().toLocaleDateString()}.
Location: Orbiting Planet Aethra, Sector 7G.
`;

let chatSession: Chat | null = null;

export const initializeChat = (): void => {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      maxOutputTokens: 300,
    },
  });
};

export const sendMessageToShipComputer = async (
  message: string,
  currentHistory: ChatMessage[]
): Promise<string> => {
  try {
    if (!chatSession) {
      initializeChat();
    }

    if (!chatSession) {
      throw new Error("Failed to initialize ship computer.");
    }

    // We don't need to manually pass history as the Chat object maintains it,
    // but we ensure the session exists.
    
    const result: GenerateContentResponse = await chatSession.sendMessage({
      message: message
    });

    return result.text || "SYSTEM ERROR: Empty response from core processor.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "CRITICAL ALERT: Communication sub-routine failure. Unable to process request.";
  }
};