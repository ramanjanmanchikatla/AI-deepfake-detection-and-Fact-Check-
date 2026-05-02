import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ExternalLink, CheckCircle, AlertTriangle, XCircle, Info, Gauge } from 'lucide-react';

interface ResultDisplayProps {
  result: string;
  sources?: { uri: string; title: string }[];
  isLoading: boolean;
  type: 'deepfake' | 'news';
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, sources, isLoading, type }) => {
  if (isLoading) {
    return (
      <div className="w-full p-8 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full opacity-25"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-500 font-medium">Analyzing with advanced AI...</p>
        <p className="text-xs text-gray-400">This may take up to 20 seconds.</p>
      </div>
    );
  }

  if (!result) return null;

  // Extract Veracity Score if present
  const scoreMatch = result.match(/\*\*Veracity Score\*\*:\s*(\d+)/i) || result.match(/Veracity Score:\s*(\d+)/i);
  const veracityScore = scoreMatch ? parseInt(scoreMatch[1], 10) : null;

  // Simple heuristic to determine header color based on keywords
  const isSafe = result.toLowerCase().includes("true") || result.toLowerCase().includes("real") || result.toLowerCase().includes("authentic");
  const isSuspicious = result.toLowerCase().includes("fake") || result.toLowerCase().includes("false") || result.toLowerCase().includes("misleading") || result.toLowerCase().includes("manipulated");
  
  let HeaderIcon = Info;
  let headerColor = "bg-gray-100 text-gray-800";
  let borderColor = "border-gray-200";

  if (isSafe && !isSuspicious) {
    HeaderIcon = CheckCircle;
    headerColor = "bg-green-100 text-green-800";
    borderColor = "border-green-200";
  } else if (isSuspicious) {
    HeaderIcon = AlertTriangle;
    headerColor = "bg-red-100 text-red-800";
    borderColor = "border-red-200";
  }

  // Determine meter color
  const getMeterColor = (score: number) => {
    if (score < 40) return "bg-red-500";
    if (score < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className={`w-full bg-white rounded-2xl shadow-lg border ${borderColor} overflow-hidden transition-all duration-500 ease-out transform translate-y-0 opacity-100`}>
      <div className={`px-6 py-4 flex items-center space-x-3 ${headerColor}`}>
        <HeaderIcon className="w-6 h-6" />
        <h3 className="font-bold text-lg">Analysis Result</h3>
      </div>
      
      <div className="p-6">
        {/* Veracity Meter */}
        {veracityScore !== null && (
          <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-gray-700">
                <Gauge className="w-5 h-5" />
                <span className="font-semibold">Veracity Score</span>
              </div>
              <span className="font-bold text-2xl text-gray-900">{veracityScore}/100</span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${getMeterColor(veracityScore)}`}
                style={{ width: `${veracityScore}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
              <span>False</span>
              <span>Unverified</span>
              <span>True</span>
            </div>
          </div>
        )}

        <div className="markdown-body">
          <ReactMarkdown
            components={{
              h1: ({...props}) => <h1 className="text-xl font-bold mb-3 text-gray-900" {...props} />,
              h2: ({...props}) => <h2 className="text-lg font-bold mb-2 text-gray-800 mt-4" {...props} />,
              h3: ({...props}) => <h3 className="text-md font-semibold mb-2 text-gray-800 mt-3" {...props} />,
              strong: ({...props}) => <span className="font-bold text-blue-900" {...props} />,
              ul: ({...props}) => <ul className="list-disc pl-5 space-y-1 my-2" {...props} />,
              li: ({...props}) => <li className="text-gray-700" {...props} />,
            }}
          >
            {result}
          </ReactMarkdown>
        </div>

        {sources && sources.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Verified Sources</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all group"
                >
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 group-hover:text-blue-700 truncate">{source.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;