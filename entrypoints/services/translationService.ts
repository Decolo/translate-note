import OpenAI from 'openai';
import { ChatCompletionMessage } from 'openai/resources.js';
import { getLanguageName } from '@/lib/constants';

// Remove hardcoded API key - use dynamic client initialization
let openaiClient: OpenAI | null = null;

// Function to initialize OpenAI client with user's API key
async function getOpenAIClient(): Promise<OpenAI> {
  if (!openaiClient) {
    const apiKey = await getApiKey();
    if (!apiKey) {
      throw new Error("API key not configured. Please set your API key in settings.");
    }
    
    openaiClient = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
      defaultHeaders: {
        'HTTP-Referer': 'www.learn-lang-copilot.com', // Optional. Site URL for rankings on openrouter.ai.
        'X-Title': 'learn-lang-copilot', // Optional. Site title for rankings on openrouter.ai.
      },
      dangerouslyAllowBrowser: true,
    });
  }
  return openaiClient;
}

// Function to get API key from storage
async function getApiKey(): Promise<string | null> {
  try {
    const result = await browser.storage.local.get('openai_api_key');
    return result.openai_api_key || null;
  } catch (error) {
    console.error("Error getting API key:", error);
    return null;
  }
}

// Function to set API key
export async function setApiKey(apiKey: string): Promise<void> {
  try {
    await browser.storage.local.set({ 'openai_api_key': apiKey });
    // Reset client to use new key
    openaiClient = null;
  } catch (error) {
    console.error("Error setting API key:", error);
    throw new Error("Failed to save API key");
  }
}

// Function to clear API key
export async function clearApiKey(): Promise<void> {
  try {
    await browser.storage.local.remove('openai_api_key');
    openaiClient = null;
  } catch (error) {
    console.error("Error clearing API key:", error);
    throw new Error("Failed to clear API key");
  }
}

// Function to check if API key is configured
export async function isApiKeyConfigured(): Promise<boolean> {
  const apiKey = await getApiKey();
  return !!apiKey;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
  confidence?: number;
  alternatives?: string[];
}

function buildSystemPrompt(sourceLanguage: string, targetLanguage: string): string {
  const sourceLangName = getLanguageName(sourceLanguage);
  const targetLangName = getLanguageName(targetLanguage);
  
  return `You are an expert professional translator with deep knowledge of linguistics, cultural nuances, and context-aware translation.

TASK: Translate text from ${sourceLangName} to ${targetLangName} with the highest accuracy and cultural appropriateness.

GUIDELINES:
1. **Accuracy**: Provide precise, contextually appropriate translations
2. **Natural Flow**: Ensure translations sound natural to native speakers
3. **Cultural Sensitivity**: Adapt idioms, cultural references, and context appropriately
4. **Tone Preservation**: Maintain the original tone (formal, casual, technical, etc.)
5. **Context Awareness**: Consider the context and purpose of the text
6. **Terminology**: Use appropriate technical or domain-specific terminology when applicable

SPECIAL CONSIDERATIONS:
- For technical texts: Preserve technical accuracy and use standard terminology
- For creative texts: Maintain style, rhythm, and literary devices where possible
- For formal texts: Use appropriate register and formality level
- For colloquial texts: Adapt slang and casual expressions appropriately
- For ambiguous texts: Choose the most likely interpretation based on context

OUTPUT FORMAT:
- Provide only the translated text
- No explanations or additional commentary unless specifically requested
- Maintain original formatting (line breaks, punctuation style, etc.)

If the source language is "auto", first identify the language, then proceed with translation.`;
}

export async function translateText(
  text: string,
  targetLanguage: string = "en",
  sourceLanguage: string = "auto"
): Promise<TranslationResult> {
  try {
    if (!text?.trim()) {
      throw new Error("Text is required for translation");
    }

    const openai = await getOpenAIClient(); // Get client with user's API key
    const systemPrompt = buildSystemPrompt(sourceLanguage, targetLanguage);
    
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Translate the following text:\n\n${text}`
        },
      ],
      temperature: 0.1, // Low temperature for consistent translations
      max_tokens: Math.min(4000, text.length * 3), // Reasonable token limit
    });

    const translatedText = completion.choices[0].message.content?.trim() || '';
    
    if (!translatedText) {
      throw new Error("No translation received from AI model");
    }

    // Detect source language if auto
    let detectedSourceLanguage = sourceLanguage;
    if (sourceLanguage === 'auto') {
      detectedSourceLanguage = await detectLanguage(text);
    }

    const result: TranslationResult = {
      originalText: text,
      translatedText,
      sourceLanguage: detectedSourceLanguage,
      targetLanguage,
      timestamp: Date.now(),
    };

    return result;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate text");
  }
}

// Helper function to detect language
async function detectLanguage(text: string): Promise<string> {
  try {
    const openai = await getOpenAIClient(); // Use user's API key
    
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a language detection expert. Identify the language of the given text and respond with only the ISO 639-1 language code (e.g., "en" for English, "zh-CN" for Chinese Simplified, "ja" for Japanese, etc.). If you cannot determine the language with confidence, respond with "unknown".`
        },
        {
          role: 'user',
          content: `Detect the language of this text:\n\n${text}`
        },
      ],
      temperature: 0,
      max_tokens: 10,
    });

    const detectedCode = completion.choices[0].message.content?.trim().toLowerCase() || 'unknown';
    
    // Validate the response is a reasonable language code
    if (detectedCode.length <= 5 && /^[a-z-]+$/.test(detectedCode)) {
      return detectedCode;
    }
    
    return 'unknown';
  } catch (error) {
    console.error("Language detection error:", error);
    return 'unknown';
  }
}

// Enhanced translation with context
export async function translateWithContext(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = "auto",
  context?: {
    domain?: 'technical' | 'business' | 'casual' | 'academic' | 'creative';
    tone?: 'formal' | 'informal' | 'neutral';
    audience?: 'general' | 'expert' | 'children';
  }
): Promise<TranslationResult> {
  try {
    const openai = await getOpenAIClient(); // Use user's API key
    
    let enhancedSystemPrompt = buildSystemPrompt(sourceLanguage, targetLanguage);
    
    if (context) {
      enhancedSystemPrompt += `\n\nADDITIONAL CONTEXT:`;
      
      if (context.domain) {
        enhancedSystemPrompt += `\n- Domain: ${context.domain} - Use appropriate terminology and style for this field`;
      }
      
      if (context.tone) {
        enhancedSystemPrompt += `\n- Tone: ${context.tone} - Maintain this level of formality in the translation`;
      }
      
      if (context.audience) {
        enhancedSystemPrompt += `\n- Target Audience: ${context.audience} - Adapt language complexity accordingly`;
      }
    }

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'system',
          content: enhancedSystemPrompt
        },
        {
          role: 'user',
          content: `Translate the following text:\n\n${text}`
        },
      ],
      temperature: 0.1,
      max_tokens: Math.min(4000, text.length * 3),
    });

    const translatedText = completion.choices[0].message.content?.trim() || '';
    
    if (!translatedText) {
      throw new Error("No translation received from AI model");
    }

    let detectedSourceLanguage = sourceLanguage;
    if (sourceLanguage === 'auto') {
      detectedSourceLanguage = await detectLanguage(text);
    }

    const result: TranslationResult = {
      originalText: text,
      translatedText,
      sourceLanguage: detectedSourceLanguage,
      targetLanguage,
      timestamp: Date.now(),
    };

    return result;
  } catch (error) {
    console.error("Translation with context error:", error);
    throw new Error("Failed to translate text with context");
  }
}
