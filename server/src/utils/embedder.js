import { pipeline } from "@xenova/transformers";

let embedder;

export async function getEmbedder() {
  if (!embedder) {
    console.log("🔄 Loading embedding model (first time only)...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ Embedding model loaded");
  }
  return embedder;
}

export async function getEmbedding(text) {
  try {
    const embedder = await getEmbedder();
    // Truncate text if too long (model has max length)
    const truncatedText = text.slice(0, 512);
    const output = await embedder(truncatedText, { pooling: "mean", normalize: true });
    return Array.from(output.data);
  } catch (err) {
    console.error("Error generating embedding:", err);
    throw new Error(`Failed to generate embedding: ${err.message}`);
  }
}

export async function getEmbeddingBatch(texts) {
  const embeddings = [];
  for (const text of texts) {
    const embedding = await getEmbedding(text);
    embeddings.push(embedding);
  }
  return embeddings;
}