"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
import commonEN from "./locales/en/common.json";
import commonAR from "./locales/ar/common.json";
import { LOCALE_LANGUAGE } from "@/constant/apiUrl";

const resources = {
  en: { common: commonEN },
  ar: { common: commonAR },
};

// Use the language you want from LOCALE_LANGUAGE
const selectedLanguage = resources[LOCALE_LANGUAGE] && LOCALE_LANGUAGE;

i18n.use(initReactI18next).init({
  lng: selectedLanguage, // <- set your fixed language here
  fallbackLng: selectedLanguage,
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
  resources,
});

export default i18n;
