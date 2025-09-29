const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

class QAApi {
  async askQuestion(question, category = 'General') {
    try {
      const requestBody = {
        question: question.trim(),
        category
      };
      
      console.log('🚀 QA API Request:', {
        url: `${API_BASE_URL}/qa/ask`,
        method: 'POST',
        body: requestBody,
        questionLength: question.trim().length
      });

      const headers = {
        'Content-Type': 'application/json'
      };

      // Only add auth token if it exists and is valid
      const token = localStorage.getItem('token');
      if (token && token !== 'null' && token !== 'undefined') {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔑 Using auth token');
      } else {
        console.log('🔓 No auth token, making unauthenticated request');
      }

      const response = await fetch(`${API_BASE_URL}/qa/ask`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      console.log('📡 QA API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ QA API Error Response:', errorData);
        
        // Handle validation errors with user-friendly messages
        if (errorData.error === 'Validation failed' && errorData.details) {
          const validationError = errorData.details[0];
          if (validationError.msg === 'Question cannot be empty') {
            throw new Error('Please enter a question');
          }
        }
        
        throw new Error(errorData.message || errorData.error || 'Failed to get answer');
      }

      const data = await response.json();
      console.log('✅ QA API Success:', {
        hasResponse: !!data.response,
        confidence: data.response?.confidence
      });
      return data.response;
    } catch (error) {
      console.error('QA API Error:', error);
      throw error;
    }
  }

  async getFAQ(category = null, limit = 10) {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      params.append('limit', limit.toString());

      const response = await fetch(`${API_BASE_URL}/qa/faq?${params}`, {
        headers: {
          ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch FAQ');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('FAQ API Error:', error);
      throw error;
    }
  }

  async searchQA(query, category = null) {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      if (category) params.append('category', category);

      const response = await fetch(`${API_BASE_URL}/qa/search?${params}`, {
        headers: {
          ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
        }
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search API Error:', error);
      throw error;
    }
  }

  async getUserHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/qa/user/history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      const data = await response.json();
      return data.history;
    } catch (error) {
      console.error('History API Error:', error);
      throw error;
    }
  }
}

export default new QAApi();