const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api";

class QAApi {
  // -----------------------
  // Ask a question
  // -----------------------
  async askQuestion(question) {
    try {
      const requestBody = {
        question: question.trim(),
      };

      console.log("🚀 QA API Request:", {
        url: `${API_BASE_URL}/qa/ask`,
        method: "POST",
        body: requestBody,
      });

      const headers = {
        "Content-Type": "application/json",
      };

      // Attach token if available
      const token = localStorage.getItem("token");
      if (token && token !== "null" && token !== "undefined") {
        headers["Authorization"] = `Bearer ${token}`;
        console.log("🔑 Using auth token");
      } else {
        console.log("🔓 No auth token, making unauthenticated request");
      }

      const response = await fetch(`${API_BASE_URL}/qa/ask`, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      console.log("📡 QA API Response:", {
        status: response.status,
        ok: response.ok,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ QA API Error Response:", data);

        if (data.errors?.length) {
          // Express-validator validation error
          throw new Error(data.errors[0].msg);
        }

        throw new Error(data.message || data.error || "Failed to get answer");
      }

      console.log("✅ QA API Success:", {
        hasResponse: !!data.response,
        model: data.response?.model,
        confidence: data.response?.confidence,
      });

      return data.response;
    } catch (error) {
      console.error("QA API Error:", error.message);
      throw error;
    }
  }

  // -----------------------
  // Ask a question about a specific report
  // -----------------------
  async askAboutReport(question, reportData) {
    try {
      const requestBody = {
        question: question.trim(),
        reportData: reportData,
      };

      console.log("🚀 Report QA API Request:", {
        url: `${API_BASE_URL}/qa/ask-about-report`,
        method: "POST",
        reportId: reportData.id,
      });

      const headers = {
        "Content-Type": "application/json",
      };

      // Attach token if available
      const token = localStorage.getItem("token");
      if (token && token !== "null" && token !== "undefined") {
        headers["Authorization"] = `Bearer ${token}`;
        console.log("🔑 Using auth token");
      } else {
        console.log("🔓 No auth token, making unauthenticated request");
      }

      const response = await fetch(`${API_BASE_URL}/qa/ask-about-report`, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Report QA API Response:", {
        status: response.status,
        ok: response.ok,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Report QA API Error Response:", data);

        if (data.errors?.length) {
          // Express-validator validation error
          throw new Error(data.errors[0].msg);
        }

        throw new Error(data.message || data.error || "Failed to get answer about report");
      }

      console.log("✅ Report QA API Success:", {
        hasResponse: !!data.response,
        model: data.response?.model,
        confidence: data.response?.confidence,
        reportId: data.response?.reportId,
      });

      return data.response;
    } catch (error) {
      console.error("Report QA API Error:", error.message);
      throw error;
    }
  }

  // -----------------------
  // Fetch FAQs
  // -----------------------
  async getFAQ(limit = 10) {
    try {
      const params = new URLSearchParams();
      params.append("limit", limit.toString());

      const response = await fetch(`${API_BASE_URL}/qa/faq?${params}`, {
        headers: this._authHeader(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch FAQ");
      }

      const data = await response.json();
      return data.faqs;
    } catch (error) {
      console.error("FAQ API Error:", error.message);
      throw error;
    }
  }

  // -----------------------
  // Search QA (if backend supports it)
  // -----------------------
  async searchQA(query) {
    try {
      const params = new URLSearchParams();
      params.append("q", query);

      const response = await fetch(`${API_BASE_URL}/qa/search?${params}`, {
        headers: this._authHeader(),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Search API Error:", error.message);
      throw error;
    }
  }

  // -----------------------
  // User history (if backend supports it)
  // -----------------------
  async getUserHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/qa/user/history`, {
        headers: this._authHeader(true),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }

      const data = await response.json();
      return data.history || [];
    } catch (error) {
      console.error("History API Error:", error.message);
      throw error;
    }
  }

  // -----------------------
  // Helpers
  // -----------------------
  _authHeader(required = false) {
    const token = localStorage.getItem("token");
    if (token && token !== "null" && token !== "undefined") {
      return { Authorization: `Bearer ${token}` };
    }
    if (required) {
      throw new Error("Authentication required");
    }
    return {};
  }
}

export default new QAApi();
