"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation, translations } from "@/locales/translations";

/**
 * هوک useTranslation برای دسترسی به ترجمه‌ها در هر بخش از برنامه
 * @param section - بخش ترجمه (header, home, footer و غیره)
 * @returns تابع ترجمه که با کلید ترجمه کار می‌کند
 */
export const useTranslation = (section: keyof typeof translations) => {
  const { language } = useLanguage();
  
  /**
   * تابع ترجمه برای دریافت ترجمه یک کلید در بخش مشخص شده
   * @param key - کلید ترجمه
   * @returns ترجمه متن بر اساس زبان فعلی
   */
  const t = (key: string): string => {
    return getTranslation(language, section, key);
  };
  
  return { t, language };
}; 