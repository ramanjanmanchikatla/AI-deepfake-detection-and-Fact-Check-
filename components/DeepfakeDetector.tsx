import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video, ScanEye } from 'lucide-react';
import { detectDeepfake } from '../services/geminiService';
import ResultDisplay from './ResultDisplay';
import { LanguageCode } from '../types';

interface DeepfakeDetectorProps {
  language: LanguageCode;
}

const DeepfakeDetector: React.FC<DeepfakeDetectorProps> = ({ language }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validation: 20MB limit for inline base64 to avoid API errors
      if (selectedFile.size > 20 * 1024 * 1024) { 
        alert("File size too large. Please upload files smaller than 20MB.");
        return;
      }

      setFile(selectedFile);
      setResult(""); // Clear previous result
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResult("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!file || !preview) return;

    setIsLoading(true);
    try {
      // Remove data URL prefix (e.g., "data:image/jpeg;base64," or "data:video/mp4;base64,")
      const base64Data = preview.split(',')[1];
      const mimeType = file.type;

      const analysisText = await detectDeepfake(base64Data, mimeType, language);
      setResult(analysisText);
    } catch (error) {
      console.error(error);
      setResult("An error occurred while analyzing the media. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Deepfake Detector</h2>
        <p className="text-gray-600">Upload an image or short video to detect AI manipulation.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        {!preview ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium text-gray-700">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500 mt-1">Supports Images & Videos (Max 20MB)</p>
            <div className="flex gap-4 mt-6">
              <div className="flex items-center text-xs text-gray-500 font-medium">
                <ImageIcon className="w-4 h-4 mr-1 text-blue-500" /> Images
              </div>
              <div className="flex items-center text-xs text-gray-500 font-medium">
                <Video className="w-4 h-4 mr-1 text-blue-500" /> Short Videos
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video flex items-center justify-center shadow-inner">
              {file?.type.startsWith('video') ? (
                 <video src={preview} controls className="max-h-[400px] w-auto max-w-full" />
              ) : (
                 <img src={preview} alt="Preview" className="max-h-[400px] w-auto max-w-full object-contain" />
              )}
              
              <button 
                onClick={clearFile}
                className="absolute top-4 right-4 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className={`
                  flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform active:scale-95 transition-all
                  ${isLoading 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'}
                `}
              >
                {isLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <ScanEye className="w-6 h-6" />
                    <span>Analyze Media</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
      </div>

      <ResultDisplay 
        result={result} 
        isLoading={isLoading} 
        type="deepfake"
      />
    </div>
  );
};

export default DeepfakeDetector;