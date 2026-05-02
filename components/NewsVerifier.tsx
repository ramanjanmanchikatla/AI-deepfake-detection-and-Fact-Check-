import React, { useState } from 'react';
import { Search, Send, FileText } from 'lucide-react';
import { verifyNews } from '../services/geminiService';
import ResultDisplay from './ResultDisplay';
import { LanguageCode } from '../types';

interface NewsVerifierProps {
  language: LanguageCode;
}

const NewsVerifier: React.FC<NewsVerifierProps> = ({ language }) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [sources, setSources] = useState<{ uri: string; title: string }[]>([]);

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResult("");
    setSources([]);

    try {
      const data = await verifyNews(query, language);
      setResult(data.text);
      setSources(data.sources);
    } catch (error) {
      console.error(error);
      setResult("An error occurred while verifying the news. Please check your internet connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">News & Fact Checker</h2>
        <p className="text-gray-600">
          Verify rumors, news, and WhatsApp forwards instantly.
          <br />
          <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full mt-2 inline-block font-medium">
            Supports Hindi, Telugu, Tamil & English
          </span>
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        <form onSubmit={handleVerify} className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Paste the news text, headline, social media post, or claim here..."
            className="w-full h-40 p-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none text-lg transition-all"
            disabled={isLoading}
          />
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold shadow-md transition-all
                ${isLoading || !query.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'}
              `}
            >
              <Search className="w-5 h-5" />
              <span>Verify</span>
            </button>
          </div>
        </form>
        
        <div className="mt-6 flex items-start space-x-3 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
          <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>
            SatyaCheck uses Google Search Grounding to cross-reference claims against reputable global and regional sources (like Alt News, Boom Live) to provide a <strong>Veracity Score</strong>.
          </p>
        </div>
      </div>

      <ResultDisplay 
        result={result} 
        sources={sources} 
        isLoading={isLoading} 
        type="news"
      />
    </div>
  );
};

export default NewsVerifier;