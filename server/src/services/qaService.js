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

  async askAboutReport(question, reportData, userId = null) {
    try {
      // Create a specialized prompt for report-specific questions
      const reportPrompt = this._createReportPrompt(question, reportData);
      const aiResponse = await aiService.generateResponse(reportPrompt);

      // Generate report-specific related questions
      const relatedQuestions = this._generateReportRelatedQuestions(reportData);

      return {
        id: Date.now().toString(),
        question,
        answer: aiResponse.answer,
        confidence: aiResponse.confidence,
        sources: [...(aiResponse.sources || []), "Patient Report Analysis"],
        model: aiResponse.model,
        relatedQuestions,
        reportId: reportData.id,
        answeredAt: new Date().toISOString(),
        userId,
      };
    } catch (err) {
      console.error("❌ askAboutReport error:", err.message);
      return {
        id: Date.now().toString(),
        question,
        answer: "⚠️ Error analyzing your report. Please consult a dermatologist for personalized advice.",
        confidence: 60,
        sources: ["System"],
        model: "Fallback",
        relatedQuestions: [],
        reportId: reportData.id,
        answeredAt: new Date().toISOString(),
        userId,
      };
    }
  }

  _createReportPrompt(question, reportData) {
    return `
You are a dermatology AI assistant helping a patient understand their skin analysis report. 

REPORT DETAILS:
- Condition: ${reportData.condition || 'Unknown'}
- Confidence Level: ${reportData.confidence || 0}%
- Summary: ${reportData.summary || 'No summary available'}
- Generated Date: ${reportData.generatedAt || 'Unknown'}
- Patient: ${reportData.patientName || 'Anonymous'}

IMPORTANT GUIDELINES:
1. Provide educational information about the diagnosed condition
2. Explain medical terms in simple language
3. Always recommend consulting a dermatologist for treatment decisions
4. Be empathetic and supportive
5. Focus on the specific report details provided
6. Do not provide specific medical treatment advice
7. Encourage professional medical consultation for serious concerns

PATIENT QUESTION: ${question}

Please provide a helpful, informative response about this specific report while following medical AI guidelines.
    `;
  }

  _generateReportRelatedQuestions(reportData) {
    const condition = reportData.condition?.toLowerCase() || '';
    
    // Condition-specific questions
    const conditionQuestions = {
      eczema: [
        "What lifestyle changes can help manage eczema?",
        "How can I prevent eczema flare-ups?",
        "What skincare routine is best for eczema?"
      ],
      acne: [
        "What are the different types of acne?",
        "How long does acne treatment typically take?",
        "Can diet affect my acne?"
      ],
      psoriasis: [
        "What triggers psoriasis flare-ups?",
        "Are there different types of psoriasis?",
        "How is psoriasis typically treated?"
      ],
      dermatitis: [
        "What's the difference between eczema and dermatitis?",
        "How can I identify my dermatitis triggers?",
        "What treatments are available for dermatitis?"
      ],
      rosacea: [
        "What are common rosacea triggers?",
        "How can I manage rosacea symptoms?",
        "What skincare ingredients should I avoid?"
      ]
    };

    // Find matching condition
    for (const [key, questions] of Object.entries(conditionQuestions)) {
      if (condition.includes(key)) {
        return questions;
      }
    }

    // Default report-related questions
    return [
      "What does this confidence level mean?",
      "Should I see a dermatologist about this?",
      "What are the next steps I should take?",
      "How accurate are these AI diagnoses?",
      "What should I monitor going forward?"
    ];
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
