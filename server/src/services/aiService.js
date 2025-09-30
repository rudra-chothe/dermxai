// services/aiService.js
import AI_CONFIG from "../config/aiConfig.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

class AIService {
  constructor() {
    this.genAI = null;
    this.model = null;
  }

  async initialize() {
    if (this.model) return;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        console.warn("⚠️  GEMINI_API_KEY not found in environment variables");
        return;
      }

      console.log("🤖 Initializing Gemini AI Service...");
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: AI_CONFIG.GENERATION_CONFIG,
      });
      console.log("✅ Gemini AI initialized successfully");
    } catch (err) {
      console.error("❌ Failed to initialize Gemini AI:", err.message);
    }
  }

  async generateResponse(question) {
    await this.initialize();

    if (!this.model) {
      console.warn("⚠️  Gemini model not available, using fallback");
      return this._fallbackResponse(question);
    }

    try {
      const prompt = `${AI_CONFIG.SYSTEM_PROMPT}\n\nUser Question: ${question}\n\nAssistant Response:`;

      console.log("🔄 Generating response from Gemini AI...");
      console.log("📝 Question:", question);
      
      const result = await this.model.generateContent(prompt);
      
      // Extract text using the proper method
      let text = "";
      try {
        text = result.response.text().trim();
      } catch (textError) {
        console.warn("⚠️  Could not extract text using .text() method:", textError.message);
        
        // Try alternative extraction
        const response = result.response;
        if (response.candidates && response.candidates[0]?.content?.parts) {
          text = response.candidates[0].content.parts
            .map(part => part.text || "")
            .join("")
            .trim();
        }
      }

      console.log("✅ Response generated successfully");
      console.log("📤 Response length:", text.length, "characters");
      
      if (!text || text.length === 0) {
        console.warn("⚠️  Empty response from Gemini, using fallback");
        console.warn("⚠️  Response data:", JSON.stringify(result.response, null, 2).substring(0, 800));
        return this._fallbackResponse(question);
      }

      return {
        answer: text,
        confidence: 90,
        sources: ["Gemini AI - Medical Knowledge Base"],
        model: "gemini-1.5-flash",
      };
    } catch (err) {
      console.error("❌ Error generating response:", err.message);
      console.error("❌ Error details:", err);
      return this._fallbackResponse(question);
    }
  }

  _fallbackResponse(question) {
    return {
      answer: `I’m sorry, I couldn’t process your request. Please consult a dermatologist for accurate advice.`,
      confidence: 60,
      sources: ["System"],
      model: "Fallback",
    };
  }
}

export default new AIService();
