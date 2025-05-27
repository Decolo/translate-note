// Translation service using a free API
// You may need to replace this with a paid API for production use

interface TranslationResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
}

export async function translateText(
  text: string,
  targetLanguage: string = "en",
  sourceLanguage: string = "auto"
): Promise<TranslationResult> {
  try {
    // For demo purposes, using a free translation API
    // In production, consider using Google Translate, DeepL, or other paid services
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(
      text
    )}`;

    const response = await fetch(url);
    const data = await response.json();

    // Parse the response (format: [[[translated text, original text, ...], ...], ...])
    const translatedText = data[0].map((item: any) => item[0]).join("");
    const detectedSourceLang = data[2] || sourceLanguage;

    const result: TranslationResult = {
      originalText: text,
      translatedText,
      sourceLanguage: detectedSourceLang,
      targetLanguage,
      timestamp: Date.now(),
    };

    return result;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate text");
  }
}
