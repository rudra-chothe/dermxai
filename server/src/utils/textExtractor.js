import fs from "fs";
import { createRequire } from "module"; // Node.js ESM helper
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse"); // import CommonJS properly

export async function extractText(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer); // call pdf-parse function

    // Clean the text
    let text = data.text
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!text || text.length < 1) {
      console.error("Extracted text is too short or empty");
    }

    console.log(`📄 Extracted ${text.length} characters from PDF`);
    return text;
  } catch (err) {
    console.error("Error extracting text:", err);
    throw new Error(`Failed to extract text: ${err.message}`);
  }
}

// Split text into chunks with overlap for better context
export function chunkText(text, chunkSize = 800, overlap = 100) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }

  console.log(`✂️  Created ${chunks.length} chunks`);
  return chunks;
}