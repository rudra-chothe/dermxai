import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import reportsService from '../services/reportsService.js';
import Report from '../models/Report.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Generate detailed report from diagnosis data
router.post('/generate', optionalAuth, async (req, res) => {
  try {
    const { diagnosisData } = req.body;
    
    if (!diagnosisData) {
      return res.status(400).json({
        error: 'Missing diagnosis data',
        message: 'Diagnosis data is required to generate a report'
      });
    }
    
    const report = await reportsService.generateReport(diagnosisData, req.user);
    
    res.json({
      message: 'Report generated successfully',
      report: {
        id: report.id,
        reportId: report.reportId,
        downloadUrl: report.downloadUrl,
        summary: report.diagnosis_summary,
        confidence: Math.round(report.confidence_score * 100),
        condition: report.diagnosis_details?.condition,
        generatedAt: report.generatedAt || report.generated_at
      }
    });
  } catch (error) {
    console.error('Report generation error:', error);
    
    res.status(500).json({
      error: 'Report generation failed',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

// Get user-specific reports from MongoDB
router.get('/', optionalAuth, async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user?.uid) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User must be logged in to view reports'
      });
    }

    console.log('🔍 Fetching reports for user:', req.user.uid);

    // Get only reports for the authenticated user by matching patient_id with Firebase UID
    const reports = await Report.find({ patient_id: req.user.uid })
      .sort({ generated_at: -1 })
      .select(
        "_id patient_id patient_name diagnosis_summary confidence_score generated_at diagnosis_details.condition local_file_path pdf_filename file_size download_count"
      )
      .limit(100); // Limit to prevent too much data

    console.log(`📊 Found ${reports.length} reports for user ${req.user.uid}`);
    
    // Debug: Log first few report patient_ids to verify filtering
    if (reports.length > 0) {
      console.log('🔍 Sample report patient_ids:', reports.slice(0, 3).map(r => ({ id: r._id, patient_id: r.patient_id })));
    }

    const formattedReports = reports.map((report) => ({
      id: report._id,
      patientName: report.patient_name,
      condition: report.diagnosis_details?.condition || "Unknown",
      confidence: Math.round((report.confidence_score || 0) * 100),
      summary: report.diagnosis_summary,
      generatedAt: report.generated_at,
      downloadAvailable: true,
      downloadUrl: `/api/reports/${report._id}/download`,
      filename: report.pdf_filename,
      fileSize: report.file_size ? Math.round(report.file_size / 1024) : 0, // KB
      downloadCount: report.download_count || 0,
      storageType: 'local'
    }));
    
    res.json({
      message: 'User reports retrieved successfully',
      reports: formattedReports,
      total: formattedReports.length,
      userId: req.user.uid
    });
  } catch (error) {
    console.error('Reports retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve reports',
      message: 'Internal server error'
    });
  }
});

// Get all reports (admin/debug route)
router.get('/all', optionalAuth, async (req, res) => {
  try {
    // This route is for admin/debugging purposes only
    console.log('⚠️  Admin route accessed: fetching all reports');
    
    const reports = await Report.find({})
      .sort({ generated_at: -1 })
      .select(
        "_id patient_id patient_name diagnosis_summary confidence_score generated_at diagnosis_details.condition local_file_path pdf_filename file_size download_count"
      )
      .limit(100);

    const formattedReports = reports.map((report) => ({
      id: report._id,
      patientId: report.patient_id,
      patientName: report.patient_name,
      condition: report.diagnosis_details?.condition || "Unknown",
      confidence: Math.round((report.confidence_score || 0) * 100),
      summary: report.diagnosis_summary,
      generatedAt: report.generated_at,
      downloadAvailable: true,
      downloadUrl: `/api/reports/${report._id}/download`,
      filename: report.pdf_filename,
      fileSize: report.file_size ? Math.round(report.file_size / 1024) : 0,
      downloadCount: report.download_count || 0,
      storageType: 'local'
    }));
    
    res.json({
      message: 'All reports retrieved successfully (admin)',
      reports: formattedReports,
      total: formattedReports.length
    });
  } catch (error) {
    console.error('All reports retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve all reports',
      message: 'Internal server error'
    });
  }
});

// Get user's specific reports using service (keep for backward compatibility)
router.get('/user', optionalAuth, async (req, res) => {
  try {
    const reports = await reportsService.getUserReports(req.user?.uid);
    
    res.json({
      message: 'User reports retrieved successfully',
      reports
    });
  } catch (error) {
    console.error('User reports retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve user reports',
      message: 'Internal server error'
    });
  }
});

// Get specific report
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const report = await reportsService.getReportById(id, req.user?.uid);
    
    res.json({
      message: 'Report retrieved successfully',
      report
    });
  } catch (error) {
    console.error('Report retrieval error:', error);
    
    if (error.message === 'Report not found') {
      return res.status(404).json({
        error: 'Report not found',
        message: 'The requested report could not be found'
      });
    }
    
    res.status(500).json({
      error: 'Failed to retrieve report',
      message: 'Internal server error'
    });
  }
});

// Download report PDF
router.get('/:id/download', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📥 Download request for report ID:', id);
    
    const downloadInfo = await reportsService.getReportDownloadUrl(id, req.user?.uid);
    console.log('📄 Download info:', downloadInfo);
    
    if (downloadInfo.type === 'local') {
      // Serve local file
      const filePath = path.join(__dirname, '../../', downloadInfo.path);
      console.log('📁 Serving local file:', filePath);
      
      try {
        // Verify file exists
        await fs.access(filePath);
        
        // Update download count in database
        try {
          const report = await Report.findById(id);
          if (report) {
            await report.incrementDownloadCount();
          }
        } catch (dbError) {
          console.warn('Failed to update download count:', dbError.message);
        }
        
        // Set appropriate headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${downloadInfo.filename}"`);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        // Send file
        res.sendFile(path.resolve(filePath));
        console.log('✅ File sent successfully');
        
      } catch (fileError) {
        console.error('❌ File not found:', fileError);
        res.status(404).json({
          error: 'File not found',
          message: 'The report file could not be found on the server'
        });
      }
    } else {
      throw new Error('Invalid download type - only local storage supported');
    }
  } catch (error) {
    console.error('❌ Download error:', error);
    
    if (error.message === 'Report not found') {
      return res.status(404).json({
        error: 'Report not found',
        message: 'The requested report could not be found'
      });
    }
    
    if (error.message === 'No downloadable file found for this report') {
      return res.status(404).json({
        error: 'File not available',
        message: 'The report file is not available for download'
      });
    }
    
    res.status(500).json({
      error: 'Download failed',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

// Get download URL (for frontend to use)
router.get('/:id/download-url', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const downloadInfo = await reportsService.getReportDownloadUrl(id, req.user?.uid);
    
    res.json({
      message: 'Download URL retrieved successfully',
      downloadUrl: downloadInfo.type === 'local' ? 
        `/api/reports/${id}/download` : 
        downloadInfo.url,
      filename: downloadInfo.filename,
      fileSize: downloadInfo.fileSize,
      storageType: downloadInfo.type
    });
  } catch (error) {
    console.error('Download URL error:', error);
    
    if (error.message === 'Report not found') {
      return res.status(404).json({
        error: 'Report not found',
        message: 'The requested report could not be found'
      });
    }
    
    res.status(500).json({
      error: 'Failed to get download URL',
      message: 'Internal server error'
    });
  }
});

// Get user statistics
router.get('/stats/user', optionalAuth, async (req, res) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User must be logged in to view statistics'
      });
    }

    const stats = await Report.getUserStats(req.user.uid);
    
    res.json({
      message: 'User statistics retrieved successfully',
      stats: stats[0] || {
        totalReports: 0,
        totalDownloads: 0,
        conditions: [],
        lastReport: null
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve statistics',
      message: 'Internal server error'
    });
  }
});

// Search reports by condition
router.get('/search/:condition', optionalAuth, async (req, res) => {
  try {
    const { condition } = req.params;
    const reports = await Report.findByCondition(condition);
    
    // Filter by user if authenticated
    const filteredReports = req.user?.uid ? 
      reports.filter(report => report.patient_id === req.user.uid) : 
      [];
    
    res.json({
      message: 'Search results retrieved successfully',
      condition,
      count: filteredReports.length,
      reports: filteredReports.map(report => ({
        id: report._id,
        patientName: report.patient_name,
        condition: report.diagnosis_details?.condition,
        confidence: Math.round((report.confidence_score || 0) * 100),
        generatedAt: report.generatedAt || report.generated_at,
        downloadUrl: `/api/reports/${report._id}/download`
      }))
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: 'Internal server error'
    });
  }
});

// Delete report (user can delete their own reports)
router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.user?.uid) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User must be logged in to delete reports'
      });
    }

    // Find report and verify ownership
    const report = await Report.findOne({ 
      _id: id, 
      patient_id: req.user.uid 
    });
    
    if (!report) {
      return res.status(404).json({
        error: 'Report not found',
        message: 'Report not found or you do not have permission to delete it'
      });
    }

    // Delete local file if it exists
    if (report.local_file_path) {
      try {
        const filePath = path.join(__dirname, '../../', report.local_file_path);
        await fs.unlink(filePath);
        console.log('🗑️  Local PDF file deleted');
      } catch (fileError) {
        console.warn('Failed to delete local file:', fileError.message);
      }
    }

    // Delete from database
    await Report.findByIdAndDelete(id);
    
    res.json({
      message: 'Report deleted successfully',
      deletedReportId: id
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      error: 'Failed to delete report',
      message: 'Internal server error'
    });
  }
});

export default router;