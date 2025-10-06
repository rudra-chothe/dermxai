import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true,
    index: true
  },
  patient_name: {
    type: String,
    required: true
  },
  patient_info: {
    fullName: String,
    email: String,
    age: Number,
    gender: String,
    phoneNumber: String,
    medicalHistory: {
      allergies: [String],
      medications: [String],
      conditions: [String],
      skinType: String,
      skinConcerns: [String]
    }
  },
  report_type: {
    type: String,
    default: 'Skin Diagnosis'
  },
  diagnosis_summary: {
    type: String,
    required: true
  },
  confidence_score: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  diagnosis_details: {
    condition: String,
    severity: String,
    affected_areas: [String],
    symptoms: [String],
    recommendations: [String],
    treatment_options: [String]
  },
  image_info: {
    original_filename: String,
    image_url: String,
    file_size: Number,
    mime_type: String
  },
  // Enhanced AI content structure
  ai_content: {
    clinicalDescription: String,
    commonSymptoms: [String],
    causesRiskFactors: [String],
    treatmentGuidelines: {
      otc: [String],
      prescription: [String],
      lifestyle: [String]
    },
    precautionaryMeasures: [String],
    urgentCareIndicators: [String]
  },
  // Local PDF storage (primary method)
  local_file_path: {
    type: String,
    required: true
  },
  pdf_filename: {
    type: String,
    required: true
  },
  // Local storage only - no cloud dependencies
  generated_by: {
    type: String,
    default: 'DermX-AI'
  },
  generated_at: {
    type: Date,
    default: Date.now
  },
  doctor_verified: {
    type: Boolean,
    default: false
  },
  verification_details: {
    verified_by: String,
    verified_at: Date,
    verification_notes: String
  },
  notes: {
    type: String,
    default: 'This is an AI-generated report. Consult a qualified dermatologist before taking any medical action.'
  },
  tags: [String],
  report_content: {
    type: String // Store the full HTML content of the report
  },
  // File management
  file_size: {
    type: Number,
    default: 0
  },
  download_count: {
    type: Number,
    default: 0
  },
  last_downloaded: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
reportSchema.index({ patient_id: 1, generated_at: -1 });
reportSchema.index({ 'diagnosis_details.condition': 1 });
reportSchema.index({ tags: 1 });
reportSchema.index({ doctor_verified: 1 });
reportSchema.index({ generated_at: -1 });

// Virtual for download URL
reportSchema.virtual('downloadUrl').get(function() {
  return `/api/reports/${this._id}/download`;
});

// Method to increment download count
reportSchema.methods.incrementDownloadCount = function() {
  this.download_count += 1;
  this.last_downloaded = new Date();
  return this.save();
};

// Static method to find reports by condition
reportSchema.statics.findByCondition = function(condition) {
  return this.find({ 'diagnosis_details.condition': new RegExp(condition, 'i') });
};

// Static method to get user statistics
reportSchema.statics.getUserStats = function(patientId) {
  return this.aggregate([
    { $match: { patient_id: patientId } },
    {
      $group: {
        _id: '$patient_id',
        totalReports: { $sum: 1 },
        totalDownloads: { $sum: '$download_count' },
        conditions: { $addToSet: '$diagnosis_details.condition' },
        lastReport: { $max: '$generated_at' }
      }
    }
  ]);
};

const Report = mongoose.model('Report', reportSchema);

export default Report;