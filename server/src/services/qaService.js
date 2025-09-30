// services/qaService.js
import aiService from "./aiService.js";

class QAService {
  async askQuestion(question, userId = null) {
    try {
      const aiResponse = await aiService.generateResponse(question);

      // Generate related questions based on the topic
      const relatedQuestions = this._generateRelatedQuestions(question);

      return {
        id: Date.now().toString(),
        question,
        answer: aiResponse.answer,
        confidence: aiResponse.confidence,
        sources: aiResponse.sources,
        model: aiResponse.model,
        relatedQuestions,
        answeredAt: new Date().toISOString(),
        userId,
      };
    } catch (err) {
      console.error("❌ askQuestion error:", err.message);
      return {
        id: Date.now().toString(),
        question,
        answer:
          "⚠️ Error retrieving an answer. Please consult a dermatologist.",
        confidence: 60,
        sources: ["System"],
        model: "Fallback",
        relatedQuestions: [],
        answeredAt: new Date().toISOString(),
        userId,
      };
    }
  }

  _generateRelatedQuestions(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Dermatology-related question suggestions
    const questionMap = {
      eczema: [
        "What triggers eczema flare-ups?",
        "Best moisturizers for eczema-prone skin?",
        "Is eczema contagious?",
      ],
      acne: [
        "What causes hormonal acne?",
        "Best treatments for acne scars?",
        "How to prevent acne breakouts?",
      ],
      psoriasis: [
        "Is psoriasis an autoimmune disease?",
        "What are the types of psoriasis?",
        "Can psoriasis be cured?",
      ],
      rash: [
        "What causes skin rashes?",
        "When should I see a doctor for a rash?",
        "How to treat allergic skin reactions?",
      ],
      melanoma: [
        "What are the signs of melanoma?",
        "How to perform a skin self-exam?",
        "What is the ABCDE rule for moles?",
      ],
      sunscreen: [
        "What SPF should I use daily?",
        "How often should I reapply sunscreen?",
        "Is mineral or chemical sunscreen better?",
      ],
    };

    // Find matching keywords
    for (const [keyword, questions] of Object.entries(questionMap)) {
      if (lowerQuestion.includes(keyword)) {
        return questions;
      }
    }

    // Default related questions
    return [
      "What are common skin conditions?",
      "How to maintain healthy skin?",
      "When should I see a dermatologist?",
    ];
  }

  getFAQ(limit = 5) {
    const faqs = [
      {
        q: "What causes eczema?",
        a: "Eczema flare-ups are often triggered by stress, allergens, and skin irritants.",
      },
      {
        q: "Is psoriasis contagious?",
        a: "No. Psoriasis is an autoimmune condition, not an infection.",
      },
      {
        q: "How can I prevent acne?",
        a: "Use gentle cleansers, avoid harsh scrubbing, and follow a consistent skincare routine.",
      },
    ];
    return faqs.slice(0, limit);
  }
}

export default new QAService();
