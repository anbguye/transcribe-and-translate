export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "中文 (简体)" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "sv", name: "Swedish", nativeName: "Svenska" },
  { code: "da", name: "Danish", nativeName: "Dansk" },
  { code: "no", name: "Norwegian", nativeName: "Norsk" },
  { code: "fi", name: "Finnish", nativeName: "Suomi" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά" },
  { code: "he", name: "Hebrew", nativeName: "עברית" },
  { code: "th", name: "Thai", nativeName: "ไทย" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu" },
];

/**
 * Validates if a language code is supported
 * @param languageCode - The language code to validate
 * @returns true if the language code is supported, false otherwise
 */
export function isValidLanguageCode(languageCode: string): boolean {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode);
}

/**
 * Gets the full language name for a given language code
 * @param languageCode - The language code to look up
 * @returns The full language name or "English" as fallback
 */
export function getLanguageName(languageCode: string): string {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
  return language ? language.name : "English";
}

/**
 * Gets the native language name for a given language code
 * @param languageCode - The language code to look up
 * @returns The native language name or "English" as fallback
 */
export function getNativeLanguageName(languageCode: string): string {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
  return language ? language.nativeName : "English";
}

// API Security Constants
export const API_RATE_LIMIT_MAX_REQUESTS = 10;
export const API_RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB max file size
export const ALLOWED_AUDIO_TYPES = [
  'audio/wav',
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/webm',
  'audio/ogg',
  'audio/flac'
];

/**
 * Validates if an uploaded file is a supported audio type
 * @param file - The file to validate
 * @returns true if the file type is supported, false otherwise
 */
export function isValidAudioFile(file: File): boolean {
  return ALLOWED_AUDIO_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE_BYTES;
}
