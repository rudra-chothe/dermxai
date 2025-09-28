import express from 'express';
import { uploadImage, handleUploadError } from '../middleware/upload.js';
import { optionalAuth } from '../middleware/auth.js';
import diagnosisService from '../services/diagnosisService.js';
import userService from '../services/userService.js';

const router = express.Router();

// Analyze skin image
router.post('/analyze', optionalAuth, uploadImage.single('image'), handleUploadError, async (req, res) => {

  try {
    diagnosisService.validateImageFile(req.file);

    const result = await diagnosisService.analyzeImage(req.file, req.user?.userId);
    
    // If authenticated and we have a Firebase UID, persist diagnosis and increment stats
    const firebaseUid = req.user?.uid;
    if (firebaseUid) {
      try {
        await userService.addDiagnosis(firebaseUid, result);
      } catch (persistErr) {
        console.warn('⚠️  Diagnosis computed but not persisted to user:', persistErr.message);
      }
    }
    console.log("Staring..........");

    res.json({
      message: 'Image analyzed successfully',
      result
    });
  } catch (error) {
    console.error('Analysis error:', error);

    if (error.message === 'No image provided' || error.message === 'Please upload an image file') {
      return res.status(400).json({
        error: 'Invalid file',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Analysis failed',
      message: process.env.NODE_ENV === 'production' ? 'Failed to analyze the image' : (error.message || 'Failed to analyze the image')
    });
  }
});

// Get analysis history (requires authentication)
router.get('/history', optionalAuth, (req, res) => {
  try {
    const history = diagnosisService.getAnalysisHistory(req.user?.userId);

    res.json({
      message: 'Analysis history retrieved successfully',
      history
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      error: 'Failed to retrieve history',
      message: 'Internal server error'
    });
  }
});

// Get specific analysis by ID
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const analysis = diagnosisService.getAnalysisById(id, req.user?.userId);

    res.json({
      message: 'Analysis retrieved successfully',
      analysis
    });
  } catch (error) {
    console.error('Analysis retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve analysis',
      message: 'Internal server error'
    });
  }
});

export default router;