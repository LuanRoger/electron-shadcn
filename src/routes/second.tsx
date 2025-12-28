import { useTranslation } from "react-i18next";
import { createFileRoute } from "@tanstack/react-router";
import NavigationMenu from "@/components/navigation-menu";

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
          <h1 className="text-4xl font-bold">{t("titleSecondPage")}</h1>
        </div>
      </div>
    </>
  );
}

export const Route = createFileRoute("/second")({
  component: SecondPage,
});
