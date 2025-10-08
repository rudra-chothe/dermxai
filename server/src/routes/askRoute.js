import express from "express";
import { getEmbedding } from "../utils/embedder.js";
import { generateAnswer } from "../utils/generator.js";
import { Chunk } from "../models/chunkModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, question, fileId } = req.body;

    if (!userId || !question) {
      return res.status(400).json({ 
        success: false,
        error: "userId and question are required" 
      });
    }

    console.log(`\n💬 Question from ${userId}: ${question}`);

    // Generate embedding for the question
    console.log("🔄 Generating question embedding...");
    const queryEmbedding = await getEmbedding(question);

    // Build filter
    const filter = { userId };
    if (fileId) {
      filter.fileId = fileId;
    }

    console.log("🔍 Searching for relevant chunks...");

    // For now, we'll use a simple similarity search since MongoDB Atlas Vector Search requires specific setup
    // In production, you would use $vectorSearch
    const allChunks = await Chunk.find(filter);
    
    // Calculate cosine similarity for each chunk
    const chunksWithScores = allChunks.map(chunk => {
      const similarity = calculateCosineSimilarity(queryEmbedding, chunk.embedding);
      return {
        ...chunk.toObject(),
        score: similarity
      };
    });

    // Sort by similarity and take top 3
    const chunks = chunksWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (chunks.length === 0) {
      return res.json({
        success: true,
        answer: "I couldn't find any relevant information in your uploaded documents. Please make sure you've uploaded PDFs related to this topic.",
        sources: [],
        relevantChunks: 0
      });
    }

    console.log(`✅ Found ${chunks.length} relevant chunks`);
    chunks.forEach((c, i) => {
      console.log(`  Chunk ${i + 1}: score=${c.score.toFixed(4)}`);
    });

    // Prepare context
    const context = chunks.map(c => c.text).join("\n\n");

    // Generate answer
    const answer = await generateAnswer(question, context);

    console.log(`✅ Answer generated\n`);

    res.json({ 
      success: true,
      answer,
      sources: chunks.map(c => ({
        filename: c.metadata?.filename,
        chunkIndex: c.metadata?.chunkIndex,
        score: c.score
      })),
      relevantChunks: chunks.length
    });
  } catch (err) {
    console.error("❌ Ask error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Alternative: Simple retrieval without generation
router.post("/retrieve", async (req, res) => {
  try {
    const { userId, question, limit = 5 } = req.body;

    if (!userId || !question) {
      return res.status(400).json({ 
        success: false,
        error: "userId and question are required" 
      });
    }

    const queryEmbedding = await getEmbedding(question);
    const allChunks = await Chunk.find({ userId });
    
    const chunksWithScores = allChunks.map(chunk => {
      const similarity = calculateCosineSimilarity(queryEmbedding, chunk.embedding);
      return {
        text: chunk.text,
        filename: chunk.metadata?.filename,
        score: similarity
      };
    });

    const chunks = chunksWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, parseInt(limit));

    res.json({ 
      success: true,
      chunks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Helper function to calculate cosine similarity
function calculateCosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

export default router;