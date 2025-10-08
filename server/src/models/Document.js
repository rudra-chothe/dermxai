import mongoose from 'mongoose';

const documentChunkSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true
  },
  chunkIndex: {
    type: Number,
    required: true
  },
  pageNumber: {
    type: Number,
    default: null
  },
  metadata: {
    type: Object,
    default: {}
  }
});

const documentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  },
  fileSize: {
    type: Number,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  chunks: [documentChunkSchema],
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processingError: {
    type: String,
    default: null
  },
  metadata: {
    pageCount: Number,
    wordCount: Number,
    language: String,
    extractedAt: Date
  }
}, {
  timestamps: true
});

// Create vector search index for embeddings
documentSchema.index({
  'chunks.embedding': '2dsphere'
});

// Compound index for user-specific queries
documentSchema.index({
  userId: 1,
  processingStatus: 1
});

export default mongoose.model('Document', documentSchema);