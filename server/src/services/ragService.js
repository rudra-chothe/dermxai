import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import Document from "../models/Document.js";
import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import mammoth from "mammoth";

class RAGService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "embedding-001",
    });

    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ["\n\n", "\n", ". ", " ", ""],
    });

    this.useFallbackEmbeddings = false;
  }

  async uploadAndProcessDocument(file, userId) {
    try {
      // Extract text from file
      const extractedText = await this.extractTextFromFile(file);

      // Create document record
      const document = new Document({
        userId,
        filename: `${Date.now()}_${file.originalname}`,
        originalName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        filePath: file.path,
        extractedText,
        processingStatus: "processing",
        metadata: {
          extractedAt: new Date(),
          wordCount: extractedText.split(/\s+/).length,
        },
      });

      await document.save();

      // Process document in background
      this.processDocumentChunks(document._id).catch(console.error);

      return {
        documentId: document._id,
        filename: document.originalName,
        status: "processing",
        message: "Document uploaded successfully. Processing embeddings...",
      };
    } catch (error) {
      console.error("Document upload error:", error);
      throw new Error("Failed to upload and process document");
    }
  }

  async extractTextFromFile(file) {
    try {
      const buffer = await fs.readFile(file.path);

      switch (file.mimetype) {
        case "application/pdf":
          const pdfData = await pdfParse(buffer);
          return pdfData.text;

        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          const docxResult = await mammoth.extractRawText({ buffer });
          return docxResult.value;

        case "application/msword":
          // For older .doc files, mammoth can handle some cases
          const docResult = await mammoth.extractRawText({ buffer });
          return docResult.value;

        case "text/plain":
          return buffer.toString("utf-8");

        default:
          throw new Error("Unsupported file type");
      }
    } catch (error) {
      console.error("Text extraction error:", error);
      throw new Error("Failed to extract text from document");
    }
  }

  async processDocumentChunks(documentId) {
    try {
      const document = await Document.findById(documentId);
      if (!document) {
        throw new Error("Document not found");
      }

      // Split text into chunks
      const chunks = await this.textSplitter.splitText(document.extractedText);

      // Generate embeddings for each chunk
      const documentChunks = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        let embedding;

        try {
          embedding = await this.embeddings.embedQuery(chunk);
        } catch (error) {
          console.warn("Embedding API failed, using fallback:", error.message);
          this.useFallbackEmbeddings = true;
          embedding = this.generateFallbackEmbedding(chunk);
        }

        documentChunks.push({
          content: chunk,
          embedding: embedding,
          chunkIndex: i,
          metadata: {
            chunkLength: chunk.length,
            wordCount: chunk.split(/\s+/).length,
          },
        });
      }

      // Update document with chunks and mark as completed
      document.chunks = documentChunks;
      document.processingStatus = "completed";
      await document.save();

      // Clean up temporary file
      try {
        await fs.unlink(document.filePath);
      } catch (unlinkError) {
        console.warn("Failed to delete temporary file:", unlinkError);
      }

      console.log(
        `Document ${documentId} processed successfully with ${chunks.length} chunks`
      );
    } catch (error) {
      console.error("Document processing error:", error);

      // Mark document as failed
      await Document.findByIdAndUpdate(documentId, {
        processingStatus: "failed",
        processingError: error.message,
      });
    }
  }

  async queryDocuments(query, userId, documentIds = null) {
    try {
      // Generate embedding for the query
      let queryEmbedding;
      try {
        queryEmbedding = await this.embeddings.embedQuery(query);
      } catch (error) {
        console.warn(
          "Query embedding API failed, using fallback:",
          error.message
        );
        this.useFallbackEmbeddings = true;
        queryEmbedding = this.generateFallbackEmbedding(query);
      }

      // For now, use a simple approach to find relevant chunks
      // In production, you would use MongoDB Atlas Vector Search
      const documents = await Document.find({
        userId: userId,
        processingStatus: "completed",
        ...(documentIds && {
          _id: {
            $in: documentIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        }),
      });

      // Calculate similarity for all chunks
      const allChunks = [];
      for (const doc of documents) {
        for (const chunk of doc.chunks) {
          const similarity = this.calculateCosineSimilarity(
            queryEmbedding,
            chunk.embedding
          );
          allChunks.push({
            documentId: doc._id,
            filename: doc.originalName,
            chunkContent: chunk.content,
            chunkIndex: chunk.chunkIndex,
            similarity: similarity,
          });
        }
      }

      // Sort by similarity and take top 5
      const relevantChunks = allChunks
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);

      if (relevantChunks.length === 0) {
        return {
          answer:
            "I couldn't find relevant information in your uploaded documents to answer this question. Please make sure you have uploaded documents and they have been processed successfully.",
          sources: [],
          confidence: 0,
        };
      }

      // Combine chunks into context
      const context = relevantChunks
        .map((chunk) => chunk.chunkContent)
        .join("\n\n");

      // Generate answer using Gemini
      const answer = await this.generateAnswer(query, context);

      // Format sources
      const sources = relevantChunks.map((chunk) => ({
        documentId: chunk.documentId,
        filename: chunk.filename,
        chunkIndex: chunk.chunkIndex,
        similarity: chunk.similarity,
        preview: chunk.chunkContent.substring(0, 200) + "...",
      }));

      return {
        answer,
        sources,
        confidence: relevantChunks[0]?.similarity || 0,
        context: context.substring(0, 500) + "...",
      };
    } catch (error) {
      console.error("Query processing error:", error);
      throw new Error("Failed to process query");
    }
  }

  async generateAnswer(query, context) {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `You are a knowledgeable dermatology AI assistant. Based on the provided medical documents, answer the user's question with accuracy, empathy, and evidence-based information.

Context from uploaded documents:
${context}

User Question: ${query}

Instructions:
1. Provide accurate, evidence-based answers based solely on the provided context
2. Use empathetic and professional language appropriate for medical discussions
3. If the context doesn't contain enough information, clearly state this limitation
4. Include relevant medical terminology but explain complex concepts clearly
5. Focus on dermatological conditions, treatments, and best practices
6. Do not provide personal medical advice or diagnoses
7. Cite specific information from the context when possible

Answer:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Answer generation error:", error);
      throw new Error("Failed to generate answer");
    }
  }

  async getUserDocuments(userId) {
    try {
      const documents = await Document.find({ userId })
        .select(
          "_id originalName fileType fileSize processingStatus createdAt metadata"
        )
        .sort({ createdAt: -1 });

      return documents.map((doc) => ({
        id: doc._id,
        filename: doc.originalName,
        fileType: doc.fileType,
        fileSize: doc.fileSize,
        status: doc.processingStatus,
        uploadedAt: doc.createdAt,
        chunkCount: doc.chunks?.length || 0,
        wordCount: doc.metadata?.wordCount || 0,
      }));
    } catch (error) {
      console.error("Get user documents error:", error);
      throw new Error("Failed to retrieve user documents");
    }
  }

  async deleteDocument(documentId, userId) {
    try {
      const document = await Document.findOne({ _id: documentId, userId });

      if (!document) {
        throw new Error("Document not found or access denied");
      }

      // Delete file if it still exists
      try {
        await fs.unlink(document.filePath);
      } catch (unlinkError) {
        console.warn("File already deleted or not found:", unlinkError);
      }

      await Document.findByIdAndDelete(documentId);

      return { success: true, message: "Document deleted successfully" };
    } catch (error) {
      console.error("Delete document error:", error);
      throw new Error("Failed to delete document");
    }
  }

  async getDocumentStatus(documentId, userId) {
    try {
      const document = await Document.findOne({
        _id: documentId,
        userId,
      }).select("processingStatus processingError metadata chunks");

      if (!document) {
        throw new Error("Document not found or access denied");
      }

      return {
        status: document.processingStatus,
        error: document.processingError,
        chunkCount: document.chunks?.length || 0,
        wordCount: document.metadata?.wordCount || 0,
      };
    } catch (error) {
      console.error("Get document status error:", error);
      throw new Error("Failed to get document status");
    }
  }

  calculateCosineSimilarity(vecA, vecB) {
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

  generateFallbackEmbedding(text) {
    // Simple fallback embedding using text characteristics
    // This is a basic implementation for demonstration
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(384).fill(0); // Standard embedding size

    // Generate features based on text characteristics
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const hash = this.simpleHash(word);
      const index = Math.abs(hash) % embedding.length;
      embedding[index] += 1 / Math.sqrt(words.length);
    }

    // Add some basic text features
    embedding[0] = text.length / 1000; // Text length feature
    embedding[1] = words.length / 100; // Word count feature
    embedding[2] = (text.match(/[.!?]/g) || []).length / 10; // Sentence count

    // Normalize the embedding
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map((val) => (norm > 0 ? val / norm : 0));
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }
}

export default new RAGService();
