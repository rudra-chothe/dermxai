import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { extractText, chunkText } from "../utils/textExtractor.js";
import { getEmbedding } from "../utils/embedder.js";
import { Chunk } from "../models/chunkModel.js";

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
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

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

router.post("/", upload.single("file"), async (req, res) => {
  let filePath;
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: "userId is required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    filePath = req.file.path;
    console.log(`\n📤 Processing upload for user: ${userId}`);
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

    console.log(`✅ Upload complete! Created ${chunks.length} chunks\n`);

    res.json({ 
      success: true, 
      message: "File processed successfully",
      fileId,
      chunksCreated: chunks.length,
      filename: req.file.originalname
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    
    // Cleanup on error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get user's uploaded files
router.get("/files/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
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
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;