import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Firebase UID - primary identifier
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Basic user information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  
  displayName: {
    type: String,
    trim: true
  },
  
  firstName: {
    type: String,
    trim: true
  },
  
  lastName: {
    type: String,
    trim: true
  },
  
  phoneNumber: {
    type: String,
    trim: true
  },
  
  photoURL: {
    type: String,
    trim: true
  },
  
  // Profile information
  dateOfBirth: {
    type: Date
  },
  
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  
  // Medical information - restructured to match validation expectations
  medicalHistory: {
    allergies: [{
      allergen: String,
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe']
      },
      notes: String
    }],
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      startDate: Date,
      endDate: Date,
      notes: String
    }],
    conditions: [{
      condition: String,
      diagnosedDate: Date,
      notes: String
    }],
    skinType: {
      type: String,
      enum: ['normal', 'dry', 'oily', 'combination', 'sensitive', 'unknown'],
      default: 'unknown'
    },
    skinConcerns: [{
      concern: String,
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe']
      },
      notes: String
    }]
  },
  
  // App-specific data
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      reports: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      shareDataForResearch: {
        type: Boolean,
        default: false
      },
      allowAnalytics: {
        type: Boolean,
        default: true
      }
    },
    language: {
      type: String,
      default: 'en'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  
  // Usage statistics
  stats: {
    totalDiagnoses: {
      type: Number,
      default: 0
    },
    totalReports: {
      type: Number,
      default: 0
    },
    totalDocuments: {
      type: Number,
      default: 0
    },
    totalQuestions: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  
  // Historical AI diagnosis results
  diagnosedDiseases: [{
    condition: {
      type: String,
      required: true,
      trim: true
    },
    confidence: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    top3: [{
      class: {
        type: String,
        required: true,
        trim: true
      },
      confidence: {
        type: Number,
        required: true
      }
    }],
    recommendations: [{
      type: String,
      trim: true
    }],
    diagnosedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  role: {
    type: String,
    enum: ['user', 'premium', 'admin'],
    default: 'user'
  },
  
  // Sign up method
  signUpMethod: {
    type: String,
    enum: ['email', 'google', 'facebook', 'apple'],
    default: 'email'
  },
  
  // Subscription information
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: false
    }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  lastSignIn: {
    type: Date,
    default: Date.now
  },
  
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      // Remove sensitive fields when converting to JSON
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better query performance (only add non-unique indexes here)
userSchema.index({ createdAt: -1 });
userSchema.index({ 'stats.lastActivity': -1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ lastSignIn: -1 });
userSchema.index({ 'diagnosedDiseases.diagnosedAt': -1 });

// Pre-save middleware to update the updatedAt field
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
userSchema.methods.updateLastActivity = function() {
  this.stats.lastActivity = new Date();
  this.lastLoginAt = new Date();
  return this.save();
};

userSchema.methods.updateLastSignIn = function() {
  this.lastSignIn = new Date();
  this.lastLoginAt = new Date();
  this.stats.lastActivity = new Date();
  return this.save();
};

userSchema.methods.incrementStat = function(statName) {
  if (this.stats[statName] !== undefined) {
    this.stats[statName] += 1;
    this.stats.lastActivity = new Date();
    return this.save();
  }
};

userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    firebaseUid: this.firebaseUid,
    email: this.email,
    displayName: this.displayName,
    firstName: this.firstName,
    lastName: this.lastName,
    photoURL: this.photoURL,
    role: this.role,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt,
    stats: this.stats
  };
};

// Static methods
userSchema.statics.findByFirebaseUid = function(firebaseUid) {
  return this.findOne({ firebaseUid });
};

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model('User', userSchema);

export default User;