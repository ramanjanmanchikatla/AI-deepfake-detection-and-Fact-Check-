import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { LanguageCode, LANGUAGES } from "../types";

const getLanguageName = (code: LanguageCode): string => {
  return LANGUAGES.find(l => l.code === code)?.name || 'English';
};

const safelyGetApiKey = (): string => {
  const key = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    console.error("API Key is missing");
    throw new Error("API Key is missing. Please select an API key using the 'Set API Key' button.");
  }
  return key;
};

// Initialize Gemini Client
const createClient = () => new GoogleGenAI({ apiKey: safelyGetApiKey() });

export const detectDeepfake = async (
  base64Data: string,
  mimeType: string,
  language: LanguageCode
): Promise<string> => {
  try {
    const ai = createClient();
    const langName = getLanguageName(language);
    
    // Using Pro model for better visual reasoning
    const modelId = "gemini-3.1-pro-preview";

    const prompt = `
      Analyze this media file strictly for signs of AI manipulation, deepfake generation, or digital alteration.
      
      Look for:
      1. Inconsistent lighting or shadows across frames (if video) or the scene.
      2. Unnatural facial movements, lack of micro-expressions, or weird blinking patterns.
      3. Artifacts around eyes, mouth, and hands.
      4. Background inconsistencies, warping, or flickering (temporal inconsistency).
      5. Digital noise patterns typical of GANs or Diffusion models.
      6. If audio is present: Check for lip-sync issues or robotic voice quality.

      Provide a structured report in ${langName} language containing:
      - **Authenticity Score**: 0-100% (where 100% is likely real, 0% is likely fake).
      - **Verdict**: Real, Suspicious, or Deepfake.
      - **Key Observations**: Bullet points of what you found.
      - **Conclusion**: A summary for a non-technical user.

      Keep the tone objective and professional.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      }
    });

    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Deepfake detection error:", error);
    throw error;
  }
};

export const verifyNews = async (
  query: string,
  language: LanguageCode
): Promise<{ text: string; sources: { uri: string; title: string }[] }> => {
  try {
    const ai = createClient();
    const langName = getLanguageName(language);
    
    // Using Flash model for faster search grounding
    const modelId = "gemini-3-flash-preview";

    const prompt = `
      Act as an expert fact-checker specializing in Indian media and regional languages (specifically ${langName}). 
      Your task is to verify the authenticity of the following text (news article, social media post, or claim):
      
      "${query}"
      
      Target Audience Language: ${langName}
      
      Instructions:
      1. Use Google Search to cross-reference this claim against reputable news sources and fact-checking organizations (e.g., Alt News, Boom Live, The Hindu, regional dailies).
      2. Pay special attention to regional context for Hindi, Telugu, and Tamil speaking regions if applicable.
      3. Determine a "Veracity Score" from 0 to 100 (0 = Proven Fake/False, 100 = Verified True).
      
      Provide a response in ${langName} with the following Markdown structure:
      
      **Veracity Score**: [0-100]
      **Verdict**: [TRUE / FALSE / MISLEADING / UNVERIFIED / SATIRE]
      
      ## Fact-Check Summary
      [Concise analysis of the claim and the facts.]
      
      ## Evidence & Sources
      [Key evidence found. Note: URLs will be automatically attached separately, just mention source names here.]
      
      ## Regional Impact
      [Briefly mention if this is viral in specific regions or context relevant to ${langName} speakers.]
      
      ## Conclusion
      [A simple one-sentence takeaway.]
      
      Be strictly factual, neutral, and culturally sensitive.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "Could not verify news.";
    
    // Extract grounding chunks for sources
    const sources: { uri: string; title: string }[] = [];
    
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          sources.push({
            uri: chunk.web.uri,
            title: chunk.web.title || new URL(chunk.web.uri).hostname
          });
        }
      });
    }

    return { text, sources };

  } catch (error) {
    console.error("News verification error:", error);
    throw error;
  }
};