// Mock Q&A database
const qaDatabase = [
  {
    id: "1",
    question: "What causes eczema flare-ups?",
    answer: "Eczema flare-ups can be triggered by various factors including stress, allergens (like pollen, dust mites, pet dander), irritants (harsh soaps, detergents), weather changes, hormonal fluctuations, and certain foods. Identifying and avoiding your personal triggers is key to managing eczema effectively.",
    category: "Eczema",
    tags: ["triggers", "flare-ups", "management"],
    confidence: 95,
    sources: ["American Academy of Dermatology", "National Eczema Association"],
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2", 
    question: "How long does it take for acne treatments to work?",
    answer: "Most acne treatments require 6-12 weeks to show significant improvement. Topical treatments like retinoids may initially cause some irritation before improvement is seen. It's important to be patient and consistent with your treatment regimen. If no improvement is seen after 12 weeks, consult your dermatologist for alternative options.",
    category: "Acne",
    tags: ["treatment", "timeline", "expectations"],
    confidence: 92,
    sources: ["Journal of the American Academy of Dermatology", "Clinical studies"],
    createdAt: "2024-01-14T14:30:00Z"
  },
  {
    id: "3",
    question: "Is psoriasis contagious?",
    answer: "No, psoriasis is not contagious. You cannot catch psoriasis from someone else or spread it to others through physical contact. Psoriasis is an autoimmune condition where the immune system mistakenly attacks healthy skin cells, causing rapid cell turnover and the characteristic scaly patches.",
    category: "Psoriasis", 
    tags: ["contagious", "autoimmune", "misconceptions"],
    confidence: 98,
    sources: ["National Psoriasis Foundation", "Medical literature"],
    createdAt: "2024-01-13T09:15:00Z"
  }
];

class QAService {
  async askQuestion(question, category = 'General', userId = null) {
    if (!question || question.trim().length < 10) {
      throw new Error('Question must be at least 10 characters long');
    }

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock AI response generation
    const mockResponses = [
      {
        answer: "Based on current dermatological research, this condition typically responds well to topical treatments combined with lifestyle modifications. I recommend consulting with a dermatologist for a personalized treatment plan.",
        confidence: 87,
        sources: ["Dermatology journals", "Clinical guidelines"]
      },
      {
        answer: "This is a common concern in dermatology. The symptoms you're describing could be related to several factors including environmental triggers, genetic predisposition, or underlying skin barrier dysfunction. Proper diagnosis requires professional evaluation.",
        confidence: 92,
        sources: ["Medical literature", "Expert consensus"]
      },
      {
        answer: "Treatment effectiveness varies among individuals, but most patients see improvement within 4-8 weeks of consistent treatment. It's important to follow the prescribed regimen and avoid common triggers during the healing process.",
        confidence: 89,
        sources: ["Clinical studies", "Patient outcomes data"]
      }
    ];

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    const response = {
      id: Date.now().toString(),
      question,
      category,
      ...randomResponse,
      answeredAt: new Date().toISOString(),
      userId,
      relatedQuestions: [
        "What are the most effective treatments for this condition?",
        "How can I prevent future flare-ups?",
        "When should I see a dermatologist?"
      ]
    };

    return response;
  }

  getFAQ(category = null, limit = 10) {
    let faqs = [...qaDatabase];

    if (category) {
      faqs = faqs.filter(qa => 
        qa.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Sort by confidence and limit results
    faqs = faqs
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, parseInt(limit));

    return {
      faqs,
      categories: [...new Set(qaDatabase.map(qa => qa.category))]
    };
  }

  searchQA(query, category = null) {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query required');
    }

    const searchTerm = query.toLowerCase();
    let results = qaDatabase.filter(qa =>
      qa.question.toLowerCase().includes(searchTerm) ||
      qa.answer.toLowerCase().includes(searchTerm) ||
      qa.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    if (category) {
      results = results.filter(qa => 
        qa.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Sort by relevance (mock scoring)
    results = results.sort((a, b) => {
      const aScore = (a.question.toLowerCase().includes(searchTerm) ? 2 : 0) +
                     (a.answer.toLowerCase().includes(searchTerm) ? 1 : 0);
      const bScore = (b.question.toLowerCase().includes(searchTerm) ? 2 : 0) +
                     (b.answer.toLowerCase().includes(searchTerm) ? 1 : 0);
      return bScore - aScore;
    });

    return {
      query,
      results,
      count: results.length
    };
  }

  getQAByCategory(category) {
    const categoryQAs = qaDatabase.filter(qa =>
      qa.category.toLowerCase() === category.toLowerCase()
    );

    if (categoryQAs.length === 0) {
      throw new Error('Category not found');
    }

    return {
      category,
      qas: categoryQAs,
      count: categoryQAs.length
    };
  }

  getQAById(id) {
    const qa = qaDatabase.find(qa => qa.id === id);
    
    if (!qa) {
      throw new Error('Q&A not found');
    }

    // Add related questions
    const relatedQAs = qaDatabase
      .filter(related => related.id !== id && 
        (related.category === qa.category || 
         related.tags.some(tag => qa.tags.includes(tag))))
      .slice(0, 3)
      .map(related => ({
        id: related.id,
        question: related.question,
        category: related.category
      }));

    return {
      ...qa,
      relatedQAs
    };
  }

  getUserQuestionHistory(userId) {
    if (!userId) {
      throw new Error('User ID required');
    }

    // Mock user history
    const userHistory = [
      {
        id: "user_q_1",
        question: "What's the difference between eczema and psoriasis?",
        category: "General",
        askedAt: new Date(Date.now() - 86400000).toISOString(),
        answered: true
      },
      {
        id: "user_q_2",
        question: "How often should I moisturize my skin?",
        category: "Skincare",
        askedAt: new Date(Date.now() - 172800000).toISOString(),
        answered: true
      }
    ];

    return userHistory;
  }
}

export default new QAService();