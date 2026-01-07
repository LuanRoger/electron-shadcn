import { useTranslation } from "react-i18next";
import { createFileRoute } from "@tanstack/react-router";
import NavigationMenu from "@/components/navigation-menu";
import ToggleTheme from "@/components/toggle-theme";

/*
 * You can delete this page or modify it to your needs.
 * This is just a sample page to demonstrate routing.
 */

function SecondPage() {
  const { t } = useTranslation();

  return (
    <>
      <NavigationMenu />
      <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <h1 className="text-4xl font-bold">{t("설정(Setting)")}</h1>
          <ToggleTheme />
        </div>
      </div>
    </>
  );
}

export const Route = createFileRoute("/setting")({
  component: SecondPage,
});
