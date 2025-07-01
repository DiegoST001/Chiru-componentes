// ========================================
// IMPORTS
// ========================================
import enTranslations from "./locales/en.json";
import esTranslations from "./locales/es.json";
import zhTranslations from "./locales/zh.json";

// ========================================
// TYPES AND INTERFACES
// ========================================

/**
 * Recursive interface for translation objects
 * Supports nested translation structures
 */
export interface TranslationObject {
  [key: string]: string | TranslationObject;
}

/**
 * Language configuration object
 * Easily extensible for new languages
 */
export const languages = {
  en: "English",
  es: "Español",
  zh: "中文",
} as const;

export type Language = keyof typeof languages;
export const defaultLang: Language = "es";

/**
 * Helper type for nested object key access with dot notation
 * Generates union type of all possible nested keys
 */
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

/**
 * All possible translation keys derived from default language
 * Provides type safety and autocompletion
 */
export type TranslationKeys = NestedKeyOf<(typeof ui)[typeof defaultLang]>;

// ========================================
// TRANSLATION DATA
// ========================================

/**
 * Translation data object
 * Contains all language translations
 */
export const ui = {
  en: enTranslations,
  es: esTranslations,
  zh: zhTranslations,
} as const;

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Navigate through nested object using dot notation safely
 * Single Responsibility Principle: Only handles nested object navigation
 *
 * @param obj - Object to navigate through
 * @param path - Dot-separated path string
 * @returns String value if found, undefined otherwise
 */
function getNestedValue(
  obj: TranslationObject,
  path: TranslationKeys,
): string | undefined {
  const keys = path.split(".");
  let current: string | TranslationObject = obj;

  for (const key of keys) {
    if (typeof current === "object" && current !== null && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return typeof current === "string" ? current : undefined;
}

// ========================================
// PUBLIC API FUNCTIONS
// ========================================

/**
 * Get a specific translation with comprehensive fallback mechanism
 * Open/Closed Principle: Easy to extend with new fallback strategies
 * Dependency Inversion Principle: Depends on abstractions (interfaces)
 *
 * @param lang - Target language
 * @param key - Translation key (supports dot notation for nested keys)
 * @param fallback - Optional fallback text if translation not found
 * @returns Translated string with fallback chain: translation -> default lang -> fallback -> key
 */
export function getTranslation(
  lang: Language,
  key: TranslationKeys,
  fallback?: string,
): string {
  // Try to get translation in target language
  const translation = getNestedValue(ui[lang] as TranslationObject, key);
  if (translation) return translation;

  // Fallback to default language
  const defaultTranslation = getNestedValue(
    ui[defaultLang] as TranslationObject,
    key,
  );
  if (defaultTranslation) return defaultTranslation;

  // Fallback to provided fallback or key itself
  return fallback || key;
}

/**
 * Check if a language is supported
 *
 * @param lang - Language code to check
 * @returns True if language is supported
 */
export function isLanguageSupported(lang: string): lang is Language {
  return lang in languages;
}

/**
 * Get list of all supported languages
 *
 * @returns Array of supported language codes
 */
export function getSupportedLanguages(): Language[] {
  return Object.keys(languages) as Language[];
}

/**
 * Get human-readable name for a language
 *
 * @param lang - Language code
 * @returns Human-readable language name
 */
export function getLanguageName(lang: Language): string {
  return languages[lang];
}
