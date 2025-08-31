import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalDiagnoses: 0,
    recentReports: 0,
    pendingAnalyses: 0,
    accuracyRate: 0,
  });

  useEffect(() => {
    // Simulate fetching user stats
    setStats({
      totalDiagnoses: 12,
      recentReports: 5,
      pendingAnalyses: 2,
      accuracyRate: 94.5,
    });
  }, []);

  const recentActivities = [
    {
      id: 1,
      type: "diagnosis",
      title: "Skin Analysis Completed",
      description: "Mole analysis completed with 94% confidence",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "report",
      title: "New Report Generated",
      description: "Comprehensive skin health report available",
      time: "1 day ago",
      status: "completed",
    },
    {
      id: 3,
      type: "upload",
      title: "Image Uploaded",
      description: "New skin image uploaded for analysis",
      time: "3 days ago",
      status: "pending",
    },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6 pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Welcome back, {currentUser.displayName || currentUser.email}
          </p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                  {stats.totalDiagnoses}
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
                  {stats.recentReports}
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
                  {stats.pendingAnalyses}
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
                  {stats.accuracyRate}%
                </p>
              </div>
            </div>
          </Card>
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
                {recentActivities.map((activity) => (
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
                ))}
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
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                  Skin Health Score
                </h3>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  85/100
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Good condition
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
                  30 days
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
                <p className="text-xl sm:text-2xl font-bold text-purple-600">
                  +12%
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  This month
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
