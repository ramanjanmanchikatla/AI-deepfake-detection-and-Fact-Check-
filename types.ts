export type LanguageCode = 'en' | 'hi' | 'te' | 'ta' | 'bn' | 'ml';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
];

export interface AnalysisResult {
  text: string;
  sources?: { uri: string; title: string }[];
}

export type AppMode = 'home' | 'deepfake' | 'news';
