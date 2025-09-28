// Mock diagnosis results for demo purposes
const mockDiagnoses = [
  {
    condition: "Eczema",
    confidence: 87,
    description: "Eczema, also known as atopic dermatitis, is a common skin condition that causes inflammation, dryness, and itching.",
    recommendations: [
      "Keep the affected area moisturized",
      "Avoid triggers like certain soaps or fabrics",
      "Consider over-the-counter hydrocortisone cream",
      "Consult with a dermatologist for prescription treatments"
    ],
    severity: "mild",
    treatmentOptions: [
      "Topical corticosteroids",
      "Moisturizers and emollients",
      "Antihistamines for itching",
      "Avoid known triggers"
    ]
  },
  {
    condition: "Psoriasis",
    confidence: 92,
    description: "Psoriasis is a chronic autoimmune condition that causes rapid skin cell turnover, resulting in thick, scaly patches.",
    recommendations: [
      "Use prescribed topical treatments consistently",
      "Maintain good skin hygiene",
      "Consider phototherapy if recommended",
      "Manage stress levels as it can trigger flare-ups"
    ],
    severity: "moderate",
    treatmentOptions: [
      "Topical corticosteroids",
      "Vitamin D analogues",
      "Phototherapy",
      "Systemic medications for severe cases"
    ]
  },
  {
    condition: "Acne",
    confidence: 94,
    description: "Acne is a common skin condition that occurs when hair follicles become clogged with oil and dead skin cells.",
    recommendations: [
      "Use gentle, non-comedogenic skincare products",
      "Avoid picking or squeezing lesions",
      "Consider over-the-counter treatments with salicylic acid or benzoyl peroxide",
      "Maintain a consistent skincare routine"
    ],
    severity: "mild",
    treatmentOptions: [
      "Topical retinoids",
      "Benzoyl peroxide",
      "Salicylic acid",
      "Oral antibiotics for moderate to severe cases"
    ]
  }
];

import path from 'path';
import { fileURLToPath } from 'url';
import mlService from './mlService.js';
import { log } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DiagnosisService {
  async analyzeImage(imageFile, userId = null) {
    // If no image, throw
    this.validateImageFile(imageFile);

    const absolutePath = path.isAbsolute(imageFile.path)
      ? imageFile.path
      : path.join(__dirname, '../../', imageFile.path);

    try {
      console.log("Running ML Services");

      // Call Python predictor
      const prediction = await mlService.predictImage(absolutePath);

      const condition = prediction.predictedClass || 'Unknown';

      const confidence = Math.round(prediction.confidence || 0);
      const top3 = prediction.top3 || [];

      const result = {
        id: Date.now().toString(),
        condition,
        confidence,
        description: `Predicted skin disease: ${condition}`,
        recommendations: [
          'Consult a dermatologist for confirmation',
          'Follow recommended skincare practices',
          'Avoid known triggers and protect skin from sun exposure'
        ],
        top3,
        imageUrl: `/uploads/${imageFile.filename}`,
        analyzedAt: new Date().toISOString(),
        userId
      };

      // console.log(result);


      return result;
    } catch (err) {
      // By default, do NOT return mock results. Optionally allow via env flag.
      if (process.env.USE_MOCK_FALLBACK === 'true') {
        const randomDiagnosis = mockDiagnoses[Math.floor(Math.random() * mockDiagnoses.length)];
        const confidenceVal = Math.max(75, Math.min(95, randomDiagnosis.confidence + (Math.random() - 0.5) * 10));
        return {
          id: Date.now().toString(),
          ...randomDiagnosis,
          confidence: Math.round(confidenceVal),
          imageUrl: `/uploads/${imageFile.filename}`,
          analyzedAt: new Date().toISOString(),
          userId,
          fallback: true,
          error: err.message
        };
      }
      throw err;
    }
  }

  getAnalysisHistory(userId = null) {
    // Mock history data
    const mockHistory = [
      {
        id: "1",
        condition: "Eczema",
        confidence: 87,
        analyzedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        imageUrl: "/uploads/sample1.jpg"
      },
      {
        id: "2",
        condition: "Acne",
        confidence: 94,
        analyzedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        imageUrl: "/uploads/sample2.jpg"
      }
    ];

    return mockHistory;
  }

  getAnalysisById(id, userId = null) {
    // Mock detailed analysis
    const analysis = {
      id,
      condition: "Eczema",
      confidence: 87,
      description: "Eczema, also known as atopic dermatitis, is a common skin condition that causes inflammation, dryness, and itching.",
      recommendations: [
        "Keep the affected area moisturized",
        "Avoid triggers like certain soaps or fabrics",
        "Consider over-the-counter hydrocortisone cream",
        "Consult with a dermatologist for prescription treatments"
      ],
      severity: "mild",
      treatmentOptions: [
        "Topical corticosteroids",
        "Moisturizers and emollients",
        "Antihistamines for itching",
        "Avoid known triggers"
      ],
      imageUrl: "/uploads/sample.jpg",
      analyzedAt: new Date().toISOString(),
      additionalInfo: {
        affectedArea: "Arms and legs",
        duration: "Chronic condition",
        triggers: ["Stress", "Certain fabrics", "Harsh soaps"],
        whenToSeeDoctor: "If symptoms worsen or don't improve with over-the-counter treatments"
      }
    };

    return analysis;
  }

  validateImageFile(file) {
    if (!file) {
      throw new Error('No image provided');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }

    return true;
  }
}

export default new DiagnosisService();