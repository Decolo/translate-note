export interface Language {
  code: string;
  name: string;
}

export const TN_API_TOKEN = "TN_API_TOKEN";

export const LANGUAGES: Language[] = [
  { code: "auto", name: "Detect Language" },
  { code: "en", name: "English" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "zh-TW", name: "Chinese (Traditional)" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "nl", name: "Dutch" },
  { code: "th", name: "Thai" },
  { code: "vi", name: "Vietnamese" },
  { code: "tr", name: "Turkish" },
  { code: "pl", name: "Polish" },
  { code: "sv", name: "Swedish" },
  { code: "da", name: "Danish" },
  { code: "no", name: "Norwegian" },
  { code: "fi", name: "Finnish" },
];

// Create a map for quick lookups
export const LANGUAGE_MAP: Record<string, string> = LANGUAGES.reduce(
  (acc, lang) => {
    acc[lang.code] = lang.name;
    return acc;
  },
  {} as Record<string, string>
);

// Helper function to get language name by code
export function getLanguageName(code: string): string {
  return LANGUAGE_MAP[code] || code;
}

// Get languages for source selection (includes auto-detect)
export function getSourceLanguages(): Language[] {
  return LANGUAGES;
}

// Get languages for target selection (excludes auto-detect)
export function getTargetLanguages(): Language[] {
  return LANGUAGES.filter(lang => lang.code !== "auto");
} 