import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton, SkeletonCard, SkeletonActivity, SkeletonInsight } from "@/components/ui/skeleton";
import useDashboard from "../hooks/useDashboard";
import {
  User,
  Activity,
  FileText,
  MessageSquare,
  Settings,
  BarChart3,
  Calendar,
  TrendingUp,
  Shield,
  Bell,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { data, loading, error, refreshData } = useDashboard();
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
      setLastRefresh(new Date());
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [refreshData]);

  const handleRefresh = () => {
    refreshData();
    setLastRefresh(new Date());
  };

  const quickActions = [
    {
      title: "Upload Image",
      description: "Analyze new skin condition",
      icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />,
      link: "/diagnose",
      color: "bg-blue-500",
    },
    {
      title: "View Reports",
      description: "Check your analysis history",
      icon: <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />,
      link: "/reports",
      color: "bg-green-500",
    },
    {
      title: "Ask Questions",
      description: "Get expert advice",
      icon: <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />,
      link: "/qa",
      color: "bg-purple-500",
    },
    {
      title: "Document Analysis",
      description: "Analyze medical documents",
      icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />,
      link: "/documents",
      color: "bg-orange-500",
    },
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Please log in to access your dashboard.
          </p>
          <Link to="/login">
            <Button className="bg-dermx-teal hover:bg-dermx-teal/90">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-6 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Unable to Load Dashboard
              </h2>
              <p className="text-gray-600 mb-4">
                {error}
              </p>
              <Button onClick={handleRefresh} className="bg-dermx-teal hover:bg-dermx-teal/90">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6 pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Welcome back, {currentUser.displayName || currentUser.email}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="text-gray-600 hover:text-gray-900"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <p className="text-xs text-gray-500">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <Card className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Total Diagnoses
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {data.stats.totalDiagnoses}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Recent Reports
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {data.stats.recentReports}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Pending Analyses
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {data.stats.pendingAnalyses}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Accuracy Rate
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {data.stats.accuracyRate}%
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.link}>
                    <Card className="p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-dermx-teal/20">
                      <div className="flex items-center">
                        <div
                          className={`p-2 sm:p-3 rounded-lg ${action.color} text-white`}
                        >
                          {action.icon}
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                            {action.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Recent Activity
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {loading ? (
                  <>
                    <SkeletonActivity />
                    <SkeletonActivity />
                    <SkeletonActivity />
                  </>
                ) : data.activities.length > 0 ? (
                  data.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-2 sm:space-x-3"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.status === "completed"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
              <Button variant="outline" className="w-full mt-4 text-sm">
                View All Activity
              </Button>
            </Card>
          </div>
        </div>

        {/* Health Insights */}
        <div className="mt-6 sm:mt-8">
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
              Health Insights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {loading ? (
                <>
                  <SkeletonInsight />
                  <SkeletonInsight />
                  <SkeletonInsight />
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                      Skin Health Score
                    </h3>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">
                      {data.insights.skinHealthScore}/100
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {data.insights.skinHealthScore >= 80 ? 'Excellent' : 
                       data.insights.skinHealthScore >= 60 ? 'Good' : 'Needs attention'}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                      Next Checkup
                    </h3>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">
                      {data.insights.nextCheckup} days
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Recommended
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                      Improvement
                    </h3>
                    <p className={`text-xl sm:text-2xl font-bold ${
                      data.insights.improvement >= 0 ? 'text-purple-600' : 'text-red-600'
                    }`}>
                      {data.insights.improvement >= 0 ? '+' : ''}{data.insights.improvement}%
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      This month
                    </p>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
