import React from 'react';
import { LANGUAGES, LanguageCode } from '../types';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onLanguageChange }) => {
  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200">
        <Globe className="w-5 h-5" />
        <span className="font-medium hidden sm:inline">{LANGUAGES.find(l => l.code === currentLanguage)?.nativeName}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="py-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${
                currentLanguage === lang.code ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-700'
              }`}
            >
              <span>{lang.nativeName}</span>
              <span className="text-xs text-gray-400 uppercase">{lang.code}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
