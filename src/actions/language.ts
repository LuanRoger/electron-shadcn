import { LOCAL_STORAGE_KEYS } from "@/constants";
import type { i18n } from "i18next";

export function setAppLanguage(lang: string, i18n: i18n) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, lang);
  i18n.changeLanguage(lang);
  document.documentElement.lang = lang;
}

export function updateAppLanguage(i18n: i18n) {
  const localLang = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE);
  if (!localLang) {
    return;
  }

  i18n.changeLanguage(localLang);
  document.documentElement.lang = localLang;
}
