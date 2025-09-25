import userService from './userService.js';
import diagnosisService from './diagnosisService.js';
import reportsService from './reportsService.js';

class DashboardService {
  async getUserStats(userId) {
    try {
      // Get user from database
      const user = await userService.getUserByFirebaseUid(userId);
      
      if (!user) {
        // Return default stats if user not found
        return {
          totalDiagnoses: 0,
          recentReports: 0,
          pendingAnalyses: 0,
          accuracyRate: 0,
          totalQuestions: 0,
          totalDocuments: 0
        };
      }

      // Calculate stats from user data
      const stats = {
        totalDiagnoses: user.stats?.totalDiagnoses || 0,
        recentReports: user.stats?.totalReports || 0,
        pendingAnalyses: Math.floor(Math.random() * 3), // Mock pending analyses
        accuracyRate: Math.round(85 + Math.random() * 15), // Mock accuracy rate
        totalQuestions: user.stats?.totalQuestions || 0,
        totalDocuments: user.stats?.totalDocuments || 0
      };

      return stats;
    } catch (error) {
      console.error('Error getting user stats:', error);
      // Return default stats on error
      return {
        totalDiagnoses: 0,
        recentReports: 0,
        pendingAnalyses: 0,
        accuracyRate: 0,
        totalQuestions: 0,
        totalDocuments: 0
      };
    }
  }

  async getRecentActivities(userId, limit = 10) {
    try {
      // Mock recent activities - in a real app, this would come from a database
      const mockActivities = [
        {
          id: 1,
          type: "diagnosis",
          title: "Skin Analysis Completed",
          description: "Mole analysis completed with 94% confidence",
          time: "2 hours ago",
          status: "completed",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          type: "report",
          title: "New Report Generated",
          description: "Comprehensive skin health report available",
          time: "1 day ago",
          status: "completed",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          type: "upload",
          title: "Image Uploaded",
          description: "New skin image uploaded for analysis",
          time: "3 days ago",
          status: "pending",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 4,
          type: "qa",
          title: "Question Answered",
          description: "AI assistant provided guidance on skincare routine",
          time: "1 week ago",
          status: "completed",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 5,
          type: "document",
          title: "Document Analyzed",
          description: "Medical report analysis completed",
          time: "2 weeks ago",
          status: "completed",
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      // Return limited activities
      return mockActivities.slice(0, limit);
    } catch (error) {
      console.error('Error getting recent activities:', error);
      return [];
    }
  }

  async getHealthInsights(userId) {
    try {
      // Mock health insights - in a real app, this would be calculated based on user's data
      const insights = {
        skinHealthScore: Math.floor(70 + Math.random() * 30), // 70-100
        nextCheckup: Math.floor(15 + Math.random() * 45), // 15-60 days
        improvement: Math.floor(-5 + Math.random() * 20), // -5 to +15%
        riskFactors: [
          "Sun exposure without protection",
          "Irregular skincare routine"
        ],
        recommendations: [
          "Use SPF 30+ sunscreen daily",
          "Maintain consistent skincare routine",
          "Stay hydrated"
        ]
      };

      return insights;
    } catch (error) {
      console.error('Error getting health insights:', error);
      return {
        skinHealthScore: 75,
        nextCheckup: 30,
        improvement: 0,
        riskFactors: [],
        recommendations: []
      };
    }
  }

  async getDashboardOverview(userId) {
    try {
      // Get all dashboard data in one request
      const [stats, activities, insights] = await Promise.all([
        this.getUserStats(userId),
        this.getRecentActivities(userId, 5),
        this.getHealthInsights(userId)
      ]);

      return {
        stats,
        activities,
        insights
      };
    } catch (error) {
      console.error('Error getting dashboard overview:', error);
      throw error;
    }
  }
}

export default new DashboardService();
