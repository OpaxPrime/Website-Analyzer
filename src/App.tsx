import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { analyzeUrl } from './utils/analyzer';
import { AnalysisResult } from './types/analyzer';
import ScoreChart from './components/ScoreChart';
import Chat from './components/Chat';

function App() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!url) return;
    
    setLoading(true);
    setError('');
    
    try {
      const analysisResults = await analyzeUrl(url);
      setResults(analysisResults);
    } catch (err) {
      setError('Failed to analyze the website. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Website Analyzer
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., ebay.com)"
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          
          {error && (
            <p className="text-red-500 mt-4">{error}</p>
          )}
        </div>

        {results && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Analysis Results</h2>
              <ScoreChart results={results} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {Object.entries(results).map(([category, data]) => (
                  <div key={category} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2 capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <div className="text-3xl font-bold mb-4 text-blue-500">
                      {data.score}%
                    </div>
                    <ul className="space-y-2">
                      {data.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <Chat />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;