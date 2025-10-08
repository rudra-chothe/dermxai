import ragService from './src/services/ragService.js';
import { connectDB } from './src/config/database.js';
import fs from 'fs';
import path from 'path';

async function demoRAG() {
  console.log('🎯 RAG System Demo\n');

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database\n');

    // Create a sample text file for demo
    const sampleText = `
Dermatology Treatment Guidelines

Psoriasis Management:
Psoriasis is a chronic inflammatory skin condition affecting 2-3% of the population. 
Current treatment options include:

1. Topical Treatments:
   - Corticosteroids (first-line for mild to moderate psoriasis)
   - Vitamin D analogues (calcipotriol, calcitriol)
   - Topical retinoids (tazarotene)

2. Systemic Treatments:
   - Methotrexate (traditional systemic therapy)
   - Cyclosporine (for severe cases)
   - Biologics (TNF-alpha inhibitors, IL-17 inhibitors, IL-23 inhibitors)

3. Phototherapy:
   - UVB therapy
   - PUVA therapy

Biologic Therapies:
Recent advances in biologic therapies have revolutionized psoriasis treatment.
IL-17 inhibitors like secukinumab and ixekizumab show 75-90% improvement in PASI scores.
IL-23 inhibitors such as guselkumab and risankizumab demonstrate excellent long-term efficacy.

Side Effects:
Common side effects of biologics include increased infection risk and injection site reactions.
Regular monitoring for tuberculosis and hepatitis B is recommended.

Patient Education:
Patients should be educated about trigger avoidance, proper skincare, and treatment adherence.
Stress management and lifestyle modifications can significantly improve outcomes.
    `;

    const tempFilePath = path.join(process.cwd(), 'temp-demo.txt');
    fs.writeFileSync(tempFilePath, sampleText);

    // Create mock file object
    const mockFile = {
      originalname: 'psoriasis-guidelines.txt',
      mimetype: 'text/plain',
      size: sampleText.length,
      path: tempFilePath
    };

    console.log('📄 Created sample document: psoriasis-guidelines.txt\n');

    // Demo user ID
    const demoUserId = 'demo-user-123';

    // Upload and process document
    console.log('⬆️  Uploading and processing document...');
    const uploadResult = await ragService.uploadAndProcessDocument(mockFile, demoUserId);
    console.log('✅ Upload result:', uploadResult);

    // Wait for processing to complete
    console.log('\n⏳ Waiting for document processing...');
    let status = 'processing';
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max

    while (status === 'processing' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const statusResult = await ragService.getDocumentStatus(uploadResult.documentId, demoUserId);
      status = statusResult.status;
      attempts++;
      
      if (attempts % 5 === 0) {
        console.log(`   Still processing... (${attempts}s)`);
      }
    }

    if (status === 'completed') {
      console.log('✅ Document processing completed!\n');

      // Demo queries
      const queries = [
        "What are the latest treatments for psoriasis?",
        "What are the side effects of biologic therapies?",
        "How effective are IL-17 inhibitors?",
        "What should patients be educated about?"
      ];

      for (const query of queries) {
        console.log(`❓ Query: "${query}"`);
        console.log('🤔 Thinking...');
        
        try {
          const result = await ragService.queryDocuments(query, demoUserId);
          
          console.log('💡 Answer:');
          console.log(`   ${result.answer}\n`);
          
          if (result.sources.length > 0) {
            console.log('📚 Sources:');
            result.sources.forEach((source, index) => {
              console.log(`   ${index + 1}. ${source.filename} (Chunk ${source.chunkIndex + 1})`);
              console.log(`      Similarity: ${Math.round(source.similarity * 100)}%`);
            });
          }
          
          console.log('─'.repeat(80) + '\n');
        } catch (error) {
          console.log(`❌ Query failed: ${error.message}\n`);
        }
      }

      // Cleanup
      console.log('🧹 Cleaning up demo data...');
      await ragService.deleteDocument(uploadResult.documentId, demoUserId);
      console.log('✅ Demo completed successfully!');

    } else {
      console.log(`❌ Document processing failed with status: ${status}`);
    }

    // Clean up temp file
    try {
      fs.unlinkSync(tempFilePath);
    } catch (error) {
      console.warn('Warning: Could not delete temp file');
    }

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.error('\nMake sure:');
    console.error('- MongoDB is running and accessible');
    console.error('- GEMINI_API_KEY is set in .env file');
    console.error('- All dependencies are installed');
  }

  process.exit(0);
}

// Run demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demoRAG();
}

export default demoRAG;