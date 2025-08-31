import express from 'express';
import { uploadDocument, handleUploadError } from '../middleware/upload.js';
import { optionalAuth } from '../middleware/auth.js';
import documentsService from '../services/documentsService.js';

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

export default router;