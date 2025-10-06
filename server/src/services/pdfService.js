import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PDFService {
  constructor() {
    this.reportsDir = path.join(__dirname, '../../public/reports');
    this.ensureReportsDirectory();
  }

  async ensureReportsDirectory() {
    try {
      await fs.mkdir(this.reportsDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create reports directory:', error);
    }
  }

  async generateReportPDF(reportData, imagePath = null) {
    let browser;
    try {
      console.log('🔄 Starting PDF generation for patient:', reportData.patient_name);
      
      // Launch browser with optimized settings
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      
      const page = await browser.newPage();
      
      // Set viewport for consistent rendering
      await page.setViewport({ width: 1200, height: 1600 });
      
      // Generate HTML content
      const htmlContent = this.generateHTMLTemplate(reportData, imagePath);
      
      // Set content and wait for all resources to load
      await page.setContent(htmlContent, { 
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 30000
      });
      
      // Ensure reports directory exists
      await this.ensureReportsDirectory();
      
      // Generate unique filename with better formatting
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const timeStr = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
      const patientName = reportData.patient_name.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${patientName}_${timestamp}_${timeStr}.pdf`;
      const filePath = path.join(this.reportsDir, filename);
      
      // Generate PDF with enhanced options
      const pdfBuffer = await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        },
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `
          <div style="font-size: 10px; text-align: center; width: 100%; color: #666;">
            <span>DermX-AI Report - Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
          </div>
        `
      });

      // Get file size
      const stats = await fs.stat(filePath);
      const fileSize = stats.size;
      
      console.log('✅ PDF generated successfully:', filename, `(${Math.round(fileSize / 1024)}KB)`);
      
      return {
        filePath,
        filename,
        relativePath: `public/reports/${filename}`,
        fileSize,
        htmlContent // Store HTML content for database
      };
    } catch (error) {
      console.error('❌ PDF generation error:', error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async deletePDF(filePath) {
    try {
      await fs.unlink(filePath);
      console.log('🗑️  PDF file deleted:', filePath);
      return true;
    } catch (error) {
      console.error('Failed to delete PDF:', error);
      return false;
    }
  }

  async getPDFStats(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        exists: true
      };
    } catch (error) {
      return {
        exists: false,
        error: error.message
      };
    }
  }

  async cleanupOldReports(daysOld = 30) {
    try {
      const files = await fs.readdir(this.reportsDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      let deletedCount = 0;
      
      for (const file of files) {
        if (file.endsWith('.pdf')) {
          const filePath = path.join(this.reportsDir, file);
          const stats = await fs.stat(filePath);
          
          if (stats.birthtime < cutoffDate) {
            await fs.unlink(filePath);
            deletedCount++;
          }
        }
      }
      
      console.log(`🧹 Cleaned up ${deletedCount} old PDF reports`);
      return deletedCount;
    } catch (error) {
      console.error('Failed to cleanup old reports:', error);
      return 0;
    }
  }

  generateHTMLTemplate(reportData, imagePath) {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Convert image to base64 if provided
    let imageBase64 = '';
    if (imagePath && reportData.image_info?.image_url) {
      // For now, we'll use the image URL. In production, you might want to convert to base64
      imageBase64 = reportData.image_info.image_url;
    }

    // Prepare patient information for display
    const patientInfo = reportData.patient_info || {
      fullName: reportData.patient_name,
      email: null,
      age: null,
      gender: null,
      phoneNumber: null
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DermX-AI Diagnosis Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .header .subtitle {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .report-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .info-item {
            margin-bottom: 10px;
        }
        
        .info-label {
            font-weight: bold;
            color: #555;
        }
        
        .section {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
        }
        
        .section h2 {
            color: #667eea;
            font-size: 20px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #667eea;
        }
        
        .diagnosis-summary {
            background: #e8f4fd;
            border-left: 4px solid #667eea;
        }
        
        .confidence-score {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            margin: 10px 0;
        }
        
        .severity {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 15px;
            font-weight: bold;
            margin: 5px 0;
        }
        
        .severity.low { background: #d4edda; color: #155724; }
        .severity.moderate { background: #fff3cd; color: #856404; }
        .severity.high { background: #f8d7da; color: #721c24; }
        
        .image-section {
            text-align: center;
            margin: 20px 0;
        }
        
        .analysis-image {
            max-width: 300px;
            max-height: 300px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .recommendations {
            background: #f0f8f0;
            border-left: 4px solid #28a745;
        }
        
        .recommendations ul, .clinical-insights ul {
            padding-left: 20px;
        }
        
        .recommendations li, .clinical-insights li {
            margin-bottom: 8px;
        }
        
        .disclaimer {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin-top: 30px;
        }
        
        .disclaimer h3 {
            color: #856404;
            margin-bottom: 10px;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .tags {
            margin-top: 15px;
        }
        
        .tag {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
            margin: 2px;
        }
        
        @media print {
            .header {
                background: #667eea !important;
                -webkit-print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>DermX-AI Automated Dermatological Diagnosis Report</h1>
        <div class="subtitle">Automated Diagnosis Report</div>
    </div>
    
    <div class="container">
        <div class="report-info">
            <div>
                <div class="info-item">
                    <span class="info-label">Date & Time of Analysis:</span><br>
                    ${currentDate} | ${currentTime}
                </div>
                <div class="info-item">
                    <span class="info-label">Patient Name:</span><br>
                    ${patientInfo.fullName}
                </div>
                ${patientInfo.age ? `
                <div class="info-item">
                    <span class="info-label">Age:</span><br>
                    ${patientInfo.age} years
                </div>
                ` : ''}
                ${patientInfo.gender ? `
                <div class="info-item">
                    <span class="info-label">Gender:</span><br>
                    ${patientInfo.gender.charAt(0).toUpperCase() + patientInfo.gender.slice(1)}
                </div>
                ` : ''}
                <div class="info-item">
                    <span class="info-label">Report Type:</span><br>
                    ${reportData.report_type}
                </div>
            </div>
            <div>
                <div class="info-item">
                    <span class="info-label">Image Reference ID:</span><br>
                    ${reportData.image_info?.original_filename || 'N/A'}
                </div>
                <div class="info-item">
                    <span class="info-label">Report Generated by:</span><br>
                    ${reportData.generated_by}
                </div>
                <div class="info-item">
                    <span class="info-label">Report ID:</span><br>
                    ${reportData._id || 'Generated'}
                </div>
            </div>
        </div>

        ${imageBase64 ? `
        <div class="image-section">
            <h3>Analyzed Image</h3>
            <img src="${imageBase64}" alt="Analyzed skin condition" class="analysis-image">
        </div>
        ` : ''}

        <div class="section diagnosis-summary">
            <h2>Diagnosis Summary</h2>
            <p><strong>Predicted Disease:</strong> ${reportData.diagnosis_details?.condition || 'Unknown'}</p>
            <div class="confidence-score">${Math.round((reportData.confidence_score || 0) * 100)}% Confidence</div>
            <p><strong>Severity Level:</strong> 
                <span class="severity ${(reportData.diagnosis_details?.severity || 'moderate').toLowerCase()}">
                    ${reportData.diagnosis_details?.severity || 'Moderate'}
                </span>
            </p>
            <p><strong>Summary:</strong> ${reportData.diagnosis_summary}</p>
        </div>

        <div class="section clinical-insights">
            <h2>Clinical Insights</h2>
            <p><strong>Description of the Disease:</strong></p>
            <p>${reportData.ai_content?.clinicalDescription || 'Clinical description not available.'}</p>
            
            <p><strong>Common Symptoms:</strong></p>
            <ul>
                ${(reportData.ai_content?.commonSymptoms || reportData.diagnosis_details?.symptoms || []).map(symptom => `<li>${symptom}</li>`).join('')}
            </ul>
            
            <p><strong>Possible Causes / Risk Factors:</strong></p>
            <ul>
                ${(reportData.ai_content?.causesRiskFactors || []).map(cause => `<li>${cause}</li>`).join('')}
            </ul>
        </div>

        <div class="section recommendations">
            <h2>Treatment Guidelines</h2>
            
            <p><strong>Over-the-counter medications:</strong></p>
            <ul>
                ${(reportData.ai_content?.treatmentGuidelines?.otc || []).map(treatment => `<li>${treatment}</li>`).join('')}
            </ul>
            
            <p><strong>Prescription treatment:</strong></p>
            <ul>
                ${(reportData.ai_content?.treatmentGuidelines?.prescription || []).map(treatment => `<li>${treatment}</li>`).join('')}
            </ul>
            
            <p><strong>Lifestyle recommendations:</strong></p>
            <ul>
                ${(reportData.ai_content?.treatmentGuidelines?.lifestyle || reportData.diagnosis_details?.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>

        <div class="section">
            <h2>Precautionary Measures</h2>
            <ul>
                ${(reportData.ai_content?.precautionaryMeasures || [
                  'Avoid excessive sunlight exposure',
                  'Maintain skin hygiene',
                  'Use dermatologist-approved sunscreen',
                  'Monitor for changes in condition'
                ]).map(measure => `<li>${measure}</li>`).join('')}
            </ul>
        </div>

        <div class="section">
            <h2>When to Seek Immediate Medical Attention</h2>
            <ul>
                ${(reportData.ai_content?.urgentCareIndicators || [
                  'Rapid worsening of symptoms',
                  'Signs of infection (fever, pus, red streaking)',
                  'Severe pain or bleeding',
                  'No improvement with recommended treatment'
                ]).map(indicator => `<li>${indicator}</li>`).join('')}
            </ul>
        </div>

        ${reportData.tags && reportData.tags.length > 0 ? `
        <div class="tags">
            <strong>Tags:</strong>
            ${reportData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        ` : ''}

        <div class="disclaimer">
            <h3>⚠️ Important Disclaimer</h3>
            <p>This report is automatically generated by the DermX-AI system and may contain errors or inaccuracies. It must not be used as the sole basis for medical decisions. Users should always consult a certified dermatologist or qualified medical professional before taking any actions or treatments. Do not attempt self-diagnosis or treatment without professional guidance.</p>
            <p><strong>Additional Notes:</strong> ${reportData.notes}</p>
        </div>

        <div class="footer">
            <p><strong>Generated by:</strong> DermX-AI</p>
            <p>Report generated on ${currentDate} at ${currentTime}</p>
        </div>
    </div>
</body>
</html>`;
  }
}

export default new PDFService();