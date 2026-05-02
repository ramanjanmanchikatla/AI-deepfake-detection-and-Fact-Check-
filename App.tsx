import React, { useState, useEffect } from 'react';
import { ShieldCheck, Camera, FileText, Menu, X, Github, Key } from 'lucide-react';
import LanguageSelector from './components/LanguageSelector';
import DeepfakeDetector from './components/DeepfakeDetector';
import NewsVerifier from './components/NewsVerifier';
import { LanguageCode, AppMode } from './types';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const App: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [mode, setMode] = useState<AppMode>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkApiKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const renderContent = () => {
    switch (mode) {
      case 'deepfake':
        return <DeepfakeDetector language={currentLanguage} />;
      case 'news':
        return <NewsVerifier language={currentLanguage} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center space-y-16 py-12 animate-in fade-in duration-700">
            <div className="text-center space-y-6 max-w-2xl px-4">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
                Truth in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Digital Age</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Combating misinformation with AI. Detect deepfakes, verify news, and protect yourself from digital fraud in your local language.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button 
                  onClick={() => setMode('deepfake')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center space-x-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Detect Deepfakes</span>
                </button>
                <button 
                  onClick={() => setMode('news')}
                  className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold shadow-sm hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Verify News</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl px-4">
              {[
                {
                  icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
                  title: "AI Detection",
                  desc: "Advanced algorithms analyze pixel-level artifacts to spot manipulated media."
                },
                {
                  icon: <FileText className="w-8 h-8 text-blue-500" />,
                  title: "Fact Checking",
                  desc: "Real-time verification against global news sources to debunk fake news."
                },
                {
                  icon: <span className="text-2xl">🇮🇳</span>,
                  title: "Regional Support",
                  desc: "Built for India. Support for Hindi, Telugu, Tamil, and more."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => setMode('home')}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Satya<span className="text-blue-600">Check</span></span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {!hasApiKey && (
                <button 
                  onClick={handleOpenKeySelector}
                  className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 font-medium text-sm bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 transition-colors"
                >
                  <Key className="w-4 h-4" />
                  <span>Set API Key</span>
                </button>
              )}
              <button 
                onClick={() => setMode('deepfake')}
                className={`text-sm font-medium transition-colors ${mode === 'deepfake' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Deepfake Detector
              </button>
              <button 
                onClick={() => setMode('news')}
                className={`text-sm font-medium transition-colors ${mode === 'news' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Fact Check
              </button>
              <div className="h-4 w-px bg-gray-300"></div>
              <LanguageSelector 
                currentLanguage={currentLanguage} 
                onLanguageChange={setCurrentLanguage} 
              />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <LanguageSelector 
                currentLanguage={currentLanguage} 
                onLanguageChange={setCurrentLanguage} 
              />
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white p-4 space-y-2 shadow-lg absolute w-full z-50">
            {!hasApiKey && (
              <button 
                onClick={() => { handleOpenKeySelector(); setMobileMenuOpen(false); }}
                className="flex items-center space-x-2 w-full text-left px-4 py-3 rounded-lg bg-amber-50 text-amber-700 font-medium"
              >
                <Key className="w-5 h-5" />
                <span>Set API Key</span>
              </button>
            )}
            <button 
              onClick={() => { setMode('deepfake'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
            >
              Deepfake Detector
            </button>
            <button 
              onClick={() => { setMode('news'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
            >
              Fact Check
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© 2024 SatyaCheck Project. Built with Google Gemini.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900">Terms of Use</a>
            <a href="#" className="flex items-center hover:text-gray-900"><Github className="w-4 h-4 mr-1"/> Source</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
