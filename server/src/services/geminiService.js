import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async generateReportContent(diagnosisData) {
    try {
      const prompt = `
Generate a comprehensive dermatological diagnosis report based on the following analysis:

Condition: ${diagnosisData.condition}
Confidence: ${diagnosisData.confidence}%
Patient: ${diagnosisData.patientName || 'Anonymous'}

Please provide detailed content for each section:

1. Clinical Description of ${diagnosisData.condition}
2. Common Symptoms and Signs
3. Possible Causes and Risk Factors
4. Treatment Guidelines (over-the-counter, prescription, lifestyle)
5. Precautionary Measures
6. When to seek immediate medical attention

Format the response as a structured JSON with the following keys:
- clinicalDescription
- commonSymptoms (array)
- causesRiskFactors (array)
- treatmentGuidelines (object with otc, prescription, lifestyle arrays)
- precautionaryMeasures (array)
- urgentCareIndicators (array)
- additionalNotes

Make it medically accurate but accessible to patients. Include appropriate disclaimers about consulting healthcare professionals.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse as JSON, fallback to structured text if needed
      try {
        return JSON.parse(text);
      } catch (parseError) {
        // If JSON parsing fails, create structured response from text
        return this.parseTextResponse(text, diagnosisData);
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      // Return fallback content
      return this.getFallbackContent(diagnosisData);
    }
  }

  parseTextResponse(text, diagnosisData) {
    // Fallback parser for non-JSON responses
    return {
      clinicalDescription: `${diagnosisData.condition} is a skin condition that requires proper medical evaluation and treatment.`,
      commonSymptoms: [
        'Skin irritation or inflammation',
        'Changes in skin texture or color',
        'Possible itching or discomfort'
      ],
      causesRiskFactors: [
        'Genetic predisposition',
        'Environmental factors',
        'Lifestyle factors',
        'Age and hormonal changes'
      ],
      treatmentGuidelines: {
        otc: ['Gentle skincare products', 'Moisturizers', 'Sun protection'],
        prescription: ['Consult dermatologist for prescription options'],
        lifestyle: ['Maintain good hygiene', 'Avoid known triggers', 'Healthy diet']
      },
      precautionaryMeasures: [
        'Avoid excessive sun exposure',
        'Use gentle, fragrance-free products',
        'Maintain proper skin hygiene',
        'Monitor for changes'
      ],
      urgentCareIndicators: [
        'Rapid worsening of symptoms',
        'Signs of infection',
        'Severe pain or discomfort',
        'Systemic symptoms'
      ],
      additionalNotes: 'This AI-generated report should not replace professional medical consultation.'
    };
  }

  getFallbackContent(diagnosisData) {
    return {
      clinicalDescription: `Based on the analysis, the detected condition appears to be ${diagnosisData.condition}. This is a common dermatological condition that affects many individuals and typically requires appropriate medical care and management.`,
      commonSymptoms: [
        'Visible skin changes or lesions',
        'Possible itching or irritation',
        'Changes in skin texture',
        'Discoloration or inflammation'
      ],
      causesRiskFactors: [
        'Genetic factors',
        'Environmental exposure',
        'Hormonal changes',
        'Stress and lifestyle factors',
        'Age-related changes'
      ],
      treatmentGuidelines: {
        otc: [
          'Gentle cleansing products',
          'Moisturizing creams or lotions',
          'Sun protection (SPF 30+)',
          'Anti-inflammatory topicals as appropriate'
        ],
        prescription: [
          'Topical medications as prescribed',
          'Oral medications if recommended',
          'Specialized treatments based on severity'
        ],
        lifestyle: [
          'Maintain consistent skincare routine',
          'Avoid known triggers',
          'Stress management',
          'Healthy diet and hydration',
          'Regular exercise'
        ]
      },
      precautionaryMeasures: [
        'Avoid excessive sun exposure',
        'Use hypoallergenic products',
        'Keep affected areas clean and dry',
        'Avoid scratching or picking',
        'Monitor for changes or worsening'
      ],
      urgentCareIndicators: [
        'Rapid spread or worsening',
        'Signs of bacterial infection',
        'Severe pain or bleeding',
        'Fever or systemic symptoms',
        'No improvement with treatment'
      ],
      additionalNotes: 'This report is generated by AI analysis and should be used for informational purposes only. Always consult with a qualified dermatologist or healthcare provider for proper diagnosis and treatment.'
    };
  }
}

export default new GeminiService();