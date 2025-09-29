import { useState } from 'react';
import qaApi from '../../services/qaApi';

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const apiUrl = baseUrl + '/api';
    
    const results = {
      apiUrl: apiUrl,
      timestamp: new Date().toISOString(),
      tests: []
    };

    // Test 1: Basic connectivity
    try {
      const response = await fetch(`${baseUrl}/health`);
      const data = await response.json();
      results.tests.push({
        name: 'Health Check',
        status: response.ok ? 'PASS' : 'FAIL',
        details: data
      });
    } catch (error) {
      results.tests.push({
        name: 'Health Check',
        status: 'FAIL',
        details: error.message
      });
    }

    // Test 2: QA Test endpoint
    try {
      const response = await fetch(`${apiUrl}/qa/test`);
      const data = await response.json();
      results.tests.push({
        name: 'QA Test Endpoint',
        status: response.ok ? 'PASS' : 'FAIL',
        details: data
      });
    } catch (error) {
      results.tests.push({
        name: 'QA Test Endpoint',
        status: 'FAIL',
        details: error.message
      });
    }

    // Test 3: Ask question
    try {
      const response = await qaApi.askQuestion('What is eczema?', 'Dermatology');
      results.tests.push({
        name: 'Ask Question',
        status: 'PASS',
        details: {
          answer: response.answer.substring(0, 100) + '...',
          confidence: response.confidence,
          model: response.model
        }
      });
    } catch (error) {
      results.tests.push({
        name: 'Ask Question',
        status: 'FAIL',
        details: error.message
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white px-3 py-2 rounded-full text-xs z-50 hover:bg-red-600"
        title="Debug Panel"
      >
        🐛 Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-lg p-4 max-w-md z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm">API Debug Panel</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-zinc-500 hover:text-zinc-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <strong>API URL:</strong> {(import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api'}
        </div>
        
        <button
          onClick={runTests}
          disabled={loading}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Run Tests'}
        </button>

        {testResults && (
          <div className="mt-3 space-y-2">
            <div className="text-xs text-zinc-500">
              Last run: {new Date(testResults.timestamp).toLocaleTimeString()}
            </div>
            
            {testResults.tests.map((test, index) => (
              <div key={index} className="border border-zinc-200 dark:border-zinc-700 rounded p-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{test.name}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    test.status === 'PASS' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {test.status}
                  </span>
                </div>
                <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  <pre className="whitespace-pre-wrap">
                    {typeof test.details === 'object' 
                      ? JSON.stringify(test.details, null, 2) 
                      : test.details}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}