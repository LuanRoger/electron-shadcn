import React from "react";
import Footer from "@/components/temp/Footer";
import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <h1 className="text-4xl font-bold">{t("titleAbount")}</h1>
      </div>
      <Footer />
    </div>
  );
}
