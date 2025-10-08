import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  fileId: { type: String, required: true, index: true },
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
  metadata: {
    filename: String,
    chunkIndex: Number,
    uploadDate: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

// Regular index for queries without vector search
chunkSchema.index({ userId: 1, fileId: 1 });

export const Chunk = mongoose.model("Chunk", chunkSchema);