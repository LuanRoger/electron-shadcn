import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  resources: {
    en: {
      translation: {
        appName: "electron-shadcn",
        titleHomePage: "Home Page",
        titleSecondPage: "Second Page",
        documetation: "Documentation",
        version: "Version",
        madeBy: "Made by LuanRoger"
      },
    },
    "pt-BR": {
      translation: {
        appName: "electron-shadcn",
        titleHomePage: "Página Inicial",
        titleSecondPage: "Segunda Página",
        documetation: "Documentação",
        version: "Versão",
        madeBy: "Feito por LuanRoger"
      },
    },
  },
});
