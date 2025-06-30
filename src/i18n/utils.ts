// ========================================
// IMPORTS
// ========================================
import {
  defaultLang,
  languages,
  getTranslation,
  isLanguageSupported,
  type Language,
  type TranslationKeys,
} from "./ui";

// ========================================
// TYPES AND INTERFACES
// ========================================

/**
 * Interface for Astro instance
 * Interface Segregation Principle: Only includes needed properties
 */
interface AstroInstance {
  url: URL;
  currentLocale?: string;
}

/**
 * Translation function type
 * Provides type safety for translation calls
 */
type TranslationFunction = (key: TranslationKeys, fallback?: string) => string;

/**
 * Page translation result interface
 * Single Responsibility: Groups related translation data
 */
interface PageTranslationResult {
  lang: Language;
  t: TranslationFunction;
}

/**
 * Localized page result interface
 * Extension of PageTranslationResult with additional locale info
 */
interface LocalizedPageResult extends PageTranslationResult {
  currentLocale: Language;
}

// ========================================
// URL AND LANGUAGE UTILITIES
// ========================================

/**
 * Extract language from URL pathname
 * Single Responsibility Principle: Only handles URL language extraction
 *
 * @param url - URL object to extract language from
 * @returns Language code or default language
 */
export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split("/");

  if (isLanguageSupported(lang)) {
    return lang;
  }

  return defaultLang;
}

/**
 * Validate if a language code is supported
 * Dependency Inversion Principle: Delegates to ui module
 *
 * @param lang - Language code to validate
 * @returns True if language is supported
 */
export function validateLanguage(lang: string): lang is Language {
  return isLanguageSupported(lang);
}

// ========================================
// TRANSLATION FACTORY FUNCTIONS
// ========================================

/**
 * Create a translation function for a specific language
 * Factory Pattern: Creates configured translation functions
 * Open/Closed Principle: Easy to extend with new translation behaviors
 *
 * @param lang - Language for the translation function
 * @returns Translation function bound to the language
 */
export function useTranslations(lang: Language): TranslationFunction {
  return function t(key: TranslationKeys, fallback?: string): string {
    return getTranslation(lang, key, fallback);
  };
}

/**
 * Create page-level translation utilities from URL
 * Single Responsibility: Combines URL parsing with translation setup
 *
 * @param url - URL to extract language from
 * @returns Object with language and translation function
 */
export function usePageTranslations(url: URL): PageTranslationResult {
  const lang = getLangFromUrl(url);
  const t = useTranslations(lang);

  return { lang, t };
}

/**
 * Complete page localization setup for Astro
 * Facade Pattern: Simplifies complex localization setup
 *
 * @param astroInstance - Astro instance with URL and locale info
 * @returns Complete localization data for a page
 */
export function useLocalizePage(
  astroInstance: AstroInstance,
): LocalizedPageResult {
  const { lang, t } = usePageTranslations(astroInstance.url);
  const currentLocale = validateLanguage(astroInstance.currentLocale || "")
    ? (astroInstance.currentLocale as Language)
    : defaultLang;

  return {
    lang,
    t,
    currentLocale,
  };
}

// ========================================
// STATIC GENERATION UTILITIES
// ========================================

/**
 * Generate static paths for all supported languages
 * Single Responsibility: Only handles static path generation
 * Open/Closed Principle: Automatically includes new languages
 *
 * @returns Array of static path objects for Astro
 */
export function getStaticLanguagePaths(): Array<{
  params: { locale: string };
}> {
  return Object.keys(languages).map((locale) => ({
    params: { locale },
  }));
}

/**
 * Generate static paths with custom parameter name
 * Template Method Pattern: Customizable path generation
 *
 * @param paramName - Custom parameter name (defaults to 'locale')
 * @returns Array of static path objects
 */
export function getStaticLanguagePathsWithParam(
  paramName: string = "locale",
): Array<{ params: Record<string, string> }> {
  return Object.keys(languages).map((locale) => ({
    params: { [paramName]: locale },
  }));
}

// ========================================
// ADVANCED UTILITIES
// ========================================

/**
 * Create a memoized translation function for performance
 * Decorator Pattern: Adds caching behavior to translation function
 *
 * @param lang - Language for translations
 * @returns Memoized translation function
 */
export function useMemoizedTranslations(lang: Language): TranslationFunction {
  const cache = new Map<TranslationKeys, string>();
  const t = useTranslations(lang);

  return function memoizedT(key: TranslationKeys, fallback?: string): string {
    const cacheKey = `${key}:${fallback || ""}`;

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = t(key, fallback);
    cache.set(key, result);

    return result;
  };
}

/**
 * Batch translate multiple keys at once
 * Command Pattern: Encapsulates bulk translation operations
 *
 * @param lang - Language for translations
 * @param keys - Array of translation keys
 * @returns Object with key-value translation pairs
 */
export function batchTranslate(
  lang: Language,
  keys: TranslationKeys[],
): Record<string, string> {
  const t = useTranslations(lang);
  const result: Record<string, string> = {};

  for (const key of keys) {
    result[key] = t(key);
  }

  return result;
}

// ========================================
// TYPE GUARDS AND VALIDATORS
// ========================================

/**
 * Type guard for checking if an object is a valid AstroInstance
 *
 * @param obj - Object to check
 * @returns True if object is a valid AstroInstance
 */
export function isValidAstroInstance(obj: unknown): obj is AstroInstance {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "url" in obj &&
    obj.url instanceof URL
  );
}

/**
 * Safe wrapper for useLocalizePage with validation
 *
 * @param astroInstance - Potentially invalid Astro instance
 * @returns Localization result or throws error
 */
export function safeUseLocalizePage(
  astroInstance: unknown,
): LocalizedPageResult {
  if (!isValidAstroInstance(astroInstance)) {
    throw new Error("Invalid Astro instance provided to useLocalizePage");
  }

  return useLocalizePage(astroInstance);
}
