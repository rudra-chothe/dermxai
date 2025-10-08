import express from 'express';
import { uploadDocument, handleUploadError } from '../middleware/upload.js';
import { optionalAuth, authenticateToken } from '../middleware/auth.js';
import documentsService from '../services/documentsService.js';
import ragService from '../services/ragService.js';
import uploadRoutes from './uploadRoutes.js';
import askRoute from './askRoute.js';

const router = express.Router();

// Upload and analyze document
router.post('/analyze', optionalAuth, uploadDocument.single('document'), handleUploadError, async (req, res) => {
  try {
    documentsService.validateDocumentFile(req.file);
    
    const analysis = await documentsService.analyzeDocument(req.file, req.user?.userId);
    
    res.json({
      message: 'Document analyzed successfully',
      analysis
    });
  } catch (error) {
    console.error('Document analysis error:', error);
    
    if (error.message === 'No document provided' || 
        error.message === 'Only PDF, DOC, DOCX, and TXT files are allowed') {
      return res.status(400).json({
        error: 'Invalid file',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Analysis failed',
      message: 'Failed to analyze the document'
    });
  }
});

// Get document analysis history
router.get('/history', optionalAuth, (req, res) => {
  try {
    const documents = documentsService.getDocumentHistory(req.user?.userId);
    
    res.json({
      message: 'Document history retrieved successfully',
      documents
    });
  } catch (error) {
    console.error('Document history error:', error);
    res.status(500).json({
      error: 'Failed to retrieve document history',
      message: 'Internal server error'
    });
  }
});

// Get specific document analysis
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const document = documentsService.getDocumentById(id, req.user?.userId);
    
    res.json({
      message: 'Document analysis retrieved successfully',
      document
    });
  } catch (error) {
    console.error('Document retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve document analysis',
      message: 'Internal server error'
    });
  }
});

// Extract specific information from document
router.post('/:id/extract', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { extractionType } = req.body;
    
    const result = documentsService.extractInformation(id, extractionType, req.user?.userId);
    
    res.json({
      message: `${extractionType} extracted successfully`,
      ...result
    });
  } catch (error) {
    console.error('Extraction error:', error);
    
    if (error.message === 'Extraction type required') {
      return res.status(400).json({
        error: 'Extraction type required',
        message: 'Please specify what information to extract'
      });
    }
    
    res.status(500).json({
      error: 'Extraction failed',
      message: 'Internal server error'
    });
  }
});

// Search within documents
router.post('/search', optionalAuth, (req, res) => {
  try {
    const { query, documentIds, filters = {} } = req.body;
    
    const result = documentsService.searchDocuments(query, documentIds, filters, req.user?.userId);
    
    res.json({
      message: 'Document search completed successfully',
      ...result
    });
  } catch (error) {
    console.error('Search error:', error);
    
    if (error.message === 'Search query required') {
      return res.status(400).json({
        error: 'Search query required',
        message: 'Please provide a search query'
      });
    }
    
    res.status(500).json({
      error: 'Search failed',
      message: 'Internal server error'
    });
  }
});

// Delete document
router.delete('/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const result = documentsService.deleteDocument(id, req.user?.userId);
    
    res.json({
      message: 'Document deleted successfully',
      ...result
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      error: 'Delete failed',
      message: 'Internal server error'
    });
  }
});

// RAG System Endpoints

// Upload document for RAG processing
router.post('/upload', authenticateToken, uploadDocument.single('document'), handleUploadError, async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        error: 'No file provided',
        message: 'Please select a document to upload'
      });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: 'Invalid file type',
        message: 'Only PDF, DOC, DOCX, and TXT files are allowed'
      });
    }

    const result = await ragService.uploadAndProcessDocument(req.file, req.user.uid);
    
    res.json({
      message: 'Document uploaded successfully',
      ...result
    });
  } catch (error) {
    console.error('RAG upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: error.message || 'Failed to upload document'
    });
  }
});

// Query documents using RAG
router.post('/ask', authenticateToken, async (req, res) => {
  try {

    const { query, documentIds } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Query required',
        message: 'Please provide a question to ask'
      });
    }

    const result = await ragService.queryDocuments(query, req.user.uid, documentIds);
    
    res.json({
      message: 'Query processed successfully',
      ...result
    });
  } catch (error) {
    console.error('RAG query error:', error);
    res.status(500).json({
      error: 'Query failed',
      message: error.message || 'Failed to process query'
    });
  }
});

// Get user's uploaded documents
router.get('/files', authenticateToken, async (req, res) => {
  try {
    const documents = await ragService.getUserDocuments(req.user.uid);
    
    res.json({
      message: 'Documents retrieved successfully',
      documents
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      error: 'Failed to retrieve documents',
      message: error.message || 'Internal server error'
    });
  }
});

// Delete RAG document
router.delete('/files/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ragService.deleteDocument(id, req.user.uid);
    
    res.json({
      message: 'Document deleted successfully',
      ...result
    });
  } catch (error) {
    console.error('RAG delete error:', error);
    res.status(500).json({
      error: 'Delete failed',
      message: error.message || 'Failed to delete document'
    });
  }
});

// Get document processing status
router.get('/files/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const status = await ragService.getDocumentStatus(id, req.user.uid);
    
    res.json({
      message: 'Status retrieved successfully',
      ...status
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({
      error: 'Failed to get status',
      message: error.message || 'Internal server error'
    });
  }
});

// RAG-specific routes using the new implementation
import multer from "multer";
import fs from "fs";
import path from "path";
import { extractText, chunkText } from "../utils/textExtractor.js";
import { getEmbedding } from "../utils/embedder.js";
import { Chunk } from "../models/chunkModel.js";
import { generateAnswer } from "../utils/generator.js";

// Configure multer for RAG uploads
const ragStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const ragUpload = multer({ 
  storage: ragStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

// RAG Upload endpoint
router.post('/rag/upload', authenticateToken, ragUpload.single("file"), async (req, res) => {
  let filePath;
  try {
    const userId = req.user.uid;
    
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    filePath = req.file.path;
    console.log(`\n📤 Processing RAG upload for user: ${userId}`);
    console.log(`📁 File: ${req.file.originalname}`);

    // Extract text
    const text = await extractText(filePath);

    // Chunk text
    const chunks = chunkText(text, 800, 100);

    // Generate fileId
    const fileId = `file_${Date.now()}`;

    console.log(`🔄 Generating embeddings for ${chunks.length} chunks...`);

    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`  Processing chunk ${i + 1}/${chunks.length}`);
      
      const embedding = await getEmbedding(chunk);

      await Chunk.create({
        userId,
        fileId,
        text: chunk,
        embedding,
        metadata: {
          filename: req.file.originalname,
          chunkIndex: i,
          uploadDate: new Date()
        }
      });
    }

    // Cleanup temp file
    fs.unlinkSync(filePath);

    console.log(`✅ RAG Upload complete! Created ${chunks.length} chunks\n`);

    res.json({ 
      success: true, 
      message: "File processed successfully",
      fileId,
      chunksCreated: chunks.length,
      filename: req.file.originalname
    });
  } catch (err) {
    console.error("❌ RAG Upload error:", err);
    
    // Cleanup on error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.status(500).json({ success: false, error: err.message });
  }
});

// RAG Ask endpoint
router.post('/rag/ask', authenticateToken, async (req, res) => {
  try {
    const { question, fileId, selectedDocuments } = req.body;
    const userId = req.user.uid;

    if (!question) {
      return res.status(400).json({ 
        success: false,
        error: "question is required" 
      });
    }

    console.log(`\n💬 RAG Question from ${userId}: ${question}`);
    if (selectedDocuments && selectedDocuments.length > 0) {
      console.log(`📋 Selected documents: ${selectedDocuments.length} files`);
    }

    // Generate embedding for the question
    console.log("🔄 Generating question embedding...");
    const queryEmbedding = await getEmbedding(question);

    // Build filter based on selected documents
    const filter = { userId };
    if (selectedDocuments && selectedDocuments.length > 0) {
      // selectedDocuments contains the aggregated _id values which are actually fileIds
      filter.fileId = { $in: selectedDocuments };
      console.log(`🎯 Filtering by selected documents: ${selectedDocuments.join(', ')}`);
    } else if (fileId) {
      filter.fileId = fileId;
    }

    console.log("🔍 Searching for relevant chunks...");

    // Get all chunks for the user (filtered by selected documents if any)
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
    let answer = await generateAnswer(question, context);
    
    console.log("Raw answer from generateAnswer:", typeof answer, answer.substring(0, 200) + "...");
    
    // Final safety check - ensure no think tags get through
    if (typeof answer === 'string') {
      // If it's a JSON string, parse it first
      try {
        const parsed = JSON.parse(answer);
        if (parsed.answer) {
          // Clean the parsed answer
          parsed.answer = parsed.answer.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
          answer = JSON.stringify(parsed);
        }
      } catch (e) {
        // If not JSON, clean directly
        answer = answer.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      }
    }
    
    console.log("Final cleaned answer:", answer.substring(0, 200) + "...");
    console.log(`✅ RAG Answer generated\n`);

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
    console.error("❌ RAG Ask error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Get RAG files endpoint
router.get('/rag/upload/files/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Ensure user can only access their own files
    if (userId !== req.user.uid) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }
    
    const files = await Chunk.aggregate([
      { $match: { userId } },
      { $group: {
        _id: "$fileId",
        filename: { $first: "$metadata.filename" },
        uploadDate: { $first: "$metadata.uploadDate" },
        chunkCount: { $sum: 1 }
      }},
      { $sort: { uploadDate: -1 } }
    ]);

    res.json({ success: true, files });
  } catch (err) {
    console.error('Get RAG files error:', err);
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