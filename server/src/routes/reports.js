import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import reportsService from '../services/reportsService.js';

const router = express.Router();

// Generate detailed report
router.post('/generate', optionalAuth, (req, res) => {
  try {
    const { analysisId, includeImages = true, format = 'detailed' } = req.body;
    
    const report = reportsService.generateReport(analysisId, {
      includeImages,
      format,
      userInfo: req.user
    });
    
    res.json({
      message: 'Report generated successfully',
      report
    });
  } catch (error) {
    console.error('Report generation error:', error);
    
    if (error.message === 'Analysis ID is required to generate a report') {
      return res.status(400).json({
        error: 'Missing analysis ID',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Report generation failed',
      message: 'Internal server error'
    });
  }
});

// Get user's reports
router.get('/', optionalAuth, (req, res) => {
  try {
    const reports = reportsService.getUserReports(req.user?.userId);
    
    res.json({
      message: 'Reports retrieved successfully',
      reports
    });
  } catch (error) {
    console.error('Reports retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve reports',
      message: 'Internal server error'
    });
  }
});

// Get specific report
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const report = reportsService.getReportById(id, req.user?.userId);
    
    res.json({
      message: 'Report retrieved successfully',
      report
    });
  } catch (error) {
    console.error('Report retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve report',
      message: 'Internal server error'
    });
  }
});

// Download report (PDF/JSON)
router.get('/:id/download', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'json' } = req.query;
    
    const downloadData = reportsService.generateDownloadData(id, format);
    
    res.setHeader('Content-Type', downloadData.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadData.filename}"`);
    res.json(downloadData.data);
  } catch (error) {
    console.error('Download error:', error);
    
    if (error.message === 'PDF generation not implemented') {
      return res.status(501).json({
        error: 'PDF generation not implemented',
        message: 'PDF download feature is not yet available'
      });
    }
    
    if (error.message === 'Unsupported format') {
      return res.status(400).json({
        error: 'Unsupported format',
        message: 'Please specify a valid format (json or pdf)'
      });
    }
    
    res.status(500).json({
      error: 'Download failed',
      message: 'Internal server error'
    });
  }
});

export default router;