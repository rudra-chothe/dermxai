import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";

const Diagnose = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [recentAnalysis, setRecentAnalysis] = useState(null);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(null);
  const { currentUser, getIdToken } = useAuth();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result);
      }
    };
    setSelectedFile(file);
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const analyzeImage = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);

      // Find the file from input if not present in state
      const input = document.getElementById("file-upload");
      const file = selectedFile ?? (input?.files && input.files[0]);
      if (!file) {
        throw new Error("Please select an image file to analyze");
      }

      const formData = new FormData();
      formData.append("image", file);
      // Note: Automatic report generation is disabled - users will generate reports manually

      let token = null;
      try {
        token = await getIdToken();
      } catch (e) {}

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/diagnosis/analyze`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(
          errText || `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      console.log(response);
      console.log(data);
      setResult(data.result);

      // Check if report was generated
      if (data.report && !data.report.error) {
        setReportGenerated(data.report);
      }

      // Update recent analysis with the new result if user is authenticated
      if (currentUser && data.result) {
        setRecentAnalysis({
          condition: data.result.condition,
          confidence: data.result.confidence,
          description: data.result.description,
          analyzedAt: data.result.analyzedAt,
          recommendations: data.result.recommendations,
          top3: data.result.top3,
        });
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setResult(null);
    setSelectedFile(null);
    setReportGenerated(null);
  };

  const generateReport = async () => {
    if (!result || !currentUser) {
      alert('Please log in and complete an analysis first');
      return;
    }

    try {
      setGeneratingReport(true);
      setError(null);

      const token = await getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          diagnosisData: result
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate report');
      }

      const data = await response.json();
      console.log('Report generation response:', data);
      
      setReportGenerated(data.report);
      
      // Show success message
      const reportInfo = data.report;
      alert(`Report generated successfully!\n\nReport ID: ${reportInfo.id || reportInfo.reportId}\nCondition: ${reportInfo.condition || result.condition}\nConfidence: ${reportInfo.confidence || Math.round((result.confidence || 0))}%\nStorage: Local Storage\n\nYou can download it now or view it in the Reports page.`);
      
    } catch (err) {
      console.error('Report generation error:', err);
      setError(`Failed to generate report: ${err.message}`);
      alert(`Failed to generate report: ${err.message}`);
    } finally {
      setGeneratingReport(false);
    }
  };

  const downloadReport = async (reportId) => {
    if (!reportId) {
      alert('Report ID not found. Please try generating the report again.');
      return;
    }

    try {
      console.log('Downloading report with ID:', reportId);
      
      // Local storage only - use API endpoint

      // Use API endpoint for local files
      const token = await getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/${reportId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diagnosis_report_${reportId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Show success message
        alert('Report downloaded successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Download failed');
      }
    } catch (err) {
      console.error('Download error:', err);
      alert(`Failed to download report: ${err.message}. Please try again or check the Reports page.`);
    }
  };

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent.toLowerCase()
        );
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;

      setIsMobile(isMobileDevice || (isTouchDevice && isSmallScreen));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch recent analysis when component mounts and user is authenticated
  useEffect(() => {
    const fetchRecentAnalysis = async () => {
      if (!currentUser) return;

      try {
        setLoadingRecent(true);
        const token = await getIdToken();
        const response = await fetch("/api/diagnosis/recent", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRecentAnalysis(data.analysis);
        }
      } catch (error) {
        console.error("Error fetching recent analysis:", error);
      } finally {
        setLoadingRecent(false);
      }
    };

    fetchRecentAnalysis();
  }, [currentUser, getIdToken]);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 pb-20 md:pb-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Skin Condition Diagnosis
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          Upload an image of your skin condition for AI-powered analysis and
          diagnosis.
        </p>

        {/* Image Upload Section */}
        {!image && (
          <div
            className={`border-2 border-dashed rounded-xl h-64 sm:h-80 flex flex-col items-center justify-center p-4 sm:p-6 transition-colors mb-6 sm:mb-8 ${
              isDragging
                ? "border-dermx-teal bg-dermx-teal/5"
                : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-3 sm:mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm sm:text-base text-gray-500 text-center mb-3 sm:mb-4 px-4">
              {isMobile
                ? "Drag and drop your image here, or choose an option below"
                : "Drag and drop your image here, or click to browse"}
            </p>
            <div
              className={`flex ${
                isMobile ? "flex-col sm:flex-row" : "justify-center"
              } gap-3`}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="file-upload"
                onChange={handleFileInput}
                ref={fileInputRef}
              />
              {isMobile && (
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  id="camera-capture"
                  onChange={handleCameraCapture}
                  ref={cameraInputRef}
                />
              )}
              <Button
                className="bg-dermx-teal hover:bg-dermx-teal/90 text-sm sm:text-base"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Browse Files
              </Button>
              {isMobile && (
                <Button
                  variant="outline"
                  className="text-sm sm:text-base border-dermx-teal text-dermx-teal hover:bg-dermx-teal hover:text-white"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Take Photo
                </Button>
              )}
            </div>
          </div>
        )}

        {image && !result && (
          <div className="space-y-4 sm:space-y-6">
            <div className="relative rounded-xl overflow-hidden h-64 sm:h-80 bg-gray-100">
              <img
                src={image}
                alt="Uploaded skin condition"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-5">
              <Button
                variant="outline"
                onClick={resetAnalysis}
                className="text-sm sm:text-base"
              >
                Upload Different Image
              </Button>
              <Button
                className="bg-dermx-teal hover:bg-dermx-teal/90 text-sm sm:text-base"
                onClick={analyzeImage}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <div className="flex items-center">
                    <Loader size="small" className="mr-3" />
                    Analyzing...
                  </div>
                ) : (
                  "Analyze Image"
                )}
              </Button>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
          </div>
        )}

        {result && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 animate-scale">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-dermx-teal">
                  {result.condition}
                </h2>
                <div className="flex items-center">
                  <span className="text-sm sm:text-base text-gray-600 mr-2">
                    Confidence:
                  </span>
                  <div className="bg-gray-200 h-2 w-24 sm:w-32 rounded-full overflow-hidden">
                    <div
                      className="bg-dermx-teal h-full"
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 font-medium text-sm sm:text-base">
                    {result.confidence}%
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetAnalysis}
                className="text-sm"
              >
                New Analysis
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <img
                  src={image}
                  alt="Analyzed skin condition"
                  className="rounded-lg w-full object-cover"
                />
              </div>
              <div>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">
                    Description
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {result.description}
                  </p>
                </div>
                {Array.isArray(result.top3) && result.top3.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">
                      Top Predictions
                    </h3>
                    <div className="space-y-2">
                      {result.top3.map((t, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-700">{t.class}</span>
                          <span className="text-gray-600">
                            {t.confidence.toFixed
                              ? t.confidence.toFixed(2)
                              : t.confidence}
                            %
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-4 w-4 sm:h-5 sm:w-5 text-dermx-teal mr-2 flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm sm:text-base text-gray-600">
                          {rec}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              {reportGenerated ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center text-green-600 mb-2">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Report Generated Successfully!
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="flex-1 bg-dermx-teal hover:bg-dermx-teal/90 text-sm sm:text-base"
                      onClick={() => downloadReport(reportGenerated.reportId || reportGenerated.id)}
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Download PDF Report
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 border-dermx-lavender text-dermx-lavender hover:bg-dermx-lavender hover:text-white text-sm sm:text-base"
                      onClick={() => window.location.href = '/reports'}
                    >
                      View All Reports
                    </Button>
                  </div>
                </div>
              ) : currentUser ? (
                <Button 
                  className="w-full bg-dermx-lavender hover:bg-dermx-lavender/90 text-sm sm:text-base"
                  onClick={generateReport}
                  disabled={generatingReport}
                >
                  {generatingReport ? (
                    <div className="flex items-center">
                      <Loader size="small" className="mr-3" />
                      Generating Report...
                    </div>
                  ) : (
                    <>
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Generate Full Report
                    </>
                  )}
                </Button>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-3 text-sm">Please log in to generate detailed reports</p>
                  <Button 
                    variant="outline"
                    className="border-dermx-teal text-dermx-teal hover:bg-dermx-teal hover:text-white"
                    onClick={() => window.location.href = '/login'}
                  >
                    Log In to Generate Report
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Analysis Section */}
        {/* {currentUser && recentAnalysis && !loadingRecent && (
          <Card className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-dermx-teal/5 to-dermx-lavender/5 border-dermx-teal/20 mt-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="h-5 w-5 text-dermx-teal"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-dermx-teal">
                    Recent Analysis
                  </h3>
                </div>
                <h4 className="text-xl font-bold mb-2">
                  {recentAnalysis.condition}
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  {recentAnalysis.description}
                </p>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <div className="bg-gray-200 h-2 w-20 rounded-full overflow-hidden">
                      <div
                        className="bg-dermx-teal h-full"
                        style={{ width: `${recentAnalysis.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {recentAnalysis.confidence}%
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(recentAnalysis.analyzedAt).toLocaleDateString()}
                  </span>
                </div>
                {recentAnalysis.recommendations &&
                  recentAnalysis.recommendations.length > 0 && (
                    <div>
                      <h5 className="font-medium text-sm mb-2">
                        Key Recommendations:
                      </h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {recentAnalysis.recommendations
                          .slice(0, 2)
                          .map((rec, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-dermx-teal mr-2">•</span>
                              {rec}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
              </div>
              <div className="md:w-32 md:h-32 w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </Card>
        )} */}

        {/* {loadingRecent && currentUser && (
          <Card className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50">
            <div className="flex items-center gap-3">
              <Loader size="small" />
              <span className="text-gray-600">Loading recent analysis...</span>
            </div>
          </Card>
        )} */}
      </div>
    </div>
  );
};

export default Diagnose;