import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Download, FileText, Calendar, TrendingUp, Bot, RefreshCw } from "lucide-react";
import ReportAIChat from "@/components/reports/ReportAIChat";
import Loader from "@/components/ui/Loader";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const { currentUser, getIdToken } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchReports();
    }
  }, [currentUser]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      console.log('🔄 Fetching user-specific reports from MongoDB for user:', currentUser.uid);
      
      // Get Firebase ID token for authentication
      const token = await getIdToken();
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reports`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ User reports fetched successfully:', data.reports?.length || 0, 'reports for user', data.userId);
        setReports(data.reports || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in to view your reports.');
        }
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch reports`);
      }
    } catch (err) {
      console.error('❌ Error fetching reports:', err);
      setError(err.message);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (report) => {
    try {
      // If report has direct Appwrite URL, use it
      if (report.downloadUrl && report.isCloudStored) {
        window.open(report.downloadUrl, '_blank');
        return;
      }

      // Otherwise, use API endpoint
      const token = await getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/${report.id}/download`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (response.ok) {
        // Create blob and download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_${report.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Download failed');
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download report. Please try again.');
    }
  };

  const handleAskAI = (report) => {
    setSelectedReport(report);
    setShowAIChat(true);
  };

  const closeAIChat = () => {
    setShowAIChat(false);
    setSelectedReport(null);
  };

  // Show loading state
  if (loading && reports.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col justify-center items-center h-64">
            <Loader size="large" className="mb-6" />
            <p className="text-gray-600 text-lg">Loading your reports...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show authentication required message
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-16">
            <div className="bg-dermx-soft-purple p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <FileText className="w-12 h-12 text-dermx-lavender" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Authentication Required</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Please log in to view your personal analysis reports and medical history.
            </p>
            <Button 
              className="bg-dermx-teal hover:bg-dermx-teal/90 px-8 py-3 text-lg hover-lift"
              onClick={() => window.location.href = '/login'}
            >
              Log In to View Reports
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Analysis Reports</h1>
              <p className="text-gray-600">
                View, download, and discuss your personal skin condition analysis reports with AI
                {reports.length > 0 && (
                  <span className="ml-2 text-dermx-teal font-medium">
                    ({reports.length} report{reports.length !== 1 ? 's' : ''} found)
                  </span>
                )}
              </p>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                  <p className="text-red-800 text-sm">
                    ⚠️ Error loading reports: {error}
                  </p>
                  <button 
                    onClick={fetchReports}
                    className="text-red-600 hover:text-red-800 text-sm underline mt-1"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={fetchReports}
                disabled={loading}
                className="border-dermx-teal text-dermx-teal hover:bg-dermx-teal/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                className="bg-dermx-teal hover:bg-dermx-teal/90"
                onClick={() => window.location.href = '/diagnose'}
              >
                <FileText className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            </div>
          </div>

        {reports.length === 0 ? (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="bg-dermx-soft-purple p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <FileText className="w-12 h-12 text-dermx-lavender" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Reports Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {error ? 
                "Unable to load your reports from the database. Please check your connection and try again." :
                "You haven't generated any analysis reports yet. Start by analyzing a skin image to create your first personal report."
              }
            </p>
            <Button 
              className="bg-dermx-teal hover:bg-dermx-teal/90 px-8 py-3 text-lg hover-lift"
              onClick={() => window.location.href = '/diagnose'}
            >
              <FileText className="w-5 h-5 mr-2" />
              Start Your First Analysis
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report, index) => (
              <div
                key={report.id}
                className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in-up border border-gray-200 hover:shadow-lg transition-shadow hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {report.condition || 'Unknown Condition'}
                        </h2>
                        <div className="flex items-center bg-dermx-soft-green px-3 py-1 rounded-full">
                          <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                          <span className="text-xs font-medium text-green-800">
                            {report.confidence}% confidence
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(report.generatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long", 
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>

                      <p className="text-gray-600 mb-4">
                        {report.summary || `Analysis report for ${report.condition}`}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Patient:</span>
                          <span className="ml-2 text-gray-600">{report.patientName || 'Anonymous'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Downloads:</span>
                          <span className="ml-2 text-gray-600">{report.downloadCount || 0}</span>
                        </div>
                        {report.fileSize > 0 && (
                          <div>
                            <span className="font-medium text-gray-700">File Size:</span>
                            <span className="ml-2 text-gray-600">{report.fileSize} KB</span>
                          </div>
                        )}
                        {/* <div>
                          <span className="font-medium text-gray-700">Report ID:</span>
                          <span className="ml-2 text-gray-600 font-mono text-xs">{report.id.slice(-8)}</span>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-dermx-teal text-dermx-teal hover:bg-dermx-teal/10 flex-1"
                      onClick={() => handleDownload(report)}
                      disabled={!report.downloadAvailable}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {report.downloadAvailable ? 'Download PDF' : 'PDF Not Available'}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-dermx-lavender hover:bg-dermx-lavender/90 text-white flex-1"
                      onClick={() => handleAskAI(report)}
                    >
                      <Bot className="w-4 h-4 mr-2" />
                      Ask AI About Report
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* AI Chat Modal */}
      {showAIChat && selectedReport && (
        <ReportAIChat 
          report={selectedReport}
          onClose={closeAIChat}
        />
      )}
    </>
  );
};

export default Reports;
