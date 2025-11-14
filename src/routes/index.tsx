import ToggleTheme from "@/components/ToggleTheme";
import { useTranslation } from "react-i18next";
import LangToggle from "@/components/LangToggle";
import { createFileRoute } from "@tanstack/react-router";
import { SiElectron, SiReact, SiVite } from "@icons-pack/react-simple-icons";
import NavigationMenu from "@/components/navigation-menu";

/*
 * Update this page to modify your home page.
 */

function HomePage() {
  const iconSize = 48;
  const { t } = useTranslation();

  return (
    <>
      <NavigationMenu />
      <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <div className="inline-flex gap-2">
            <SiReact size={iconSize} />
            <SiVite size={iconSize} />
            <SiElectron size={iconSize} />
          </div>
          <span>
            <h1 className="font-mono text-4xl font-bold">{t("appName")}</h1>
            <p
              className="text-muted-foreground text-end text-sm uppercase"
              data-testid="pageTitle"
            >
              {t("titleHomePage")}
            </p>
          </span>
          <LangToggle />
          <ToggleTheme />
        </div>
        <footer className="font-tomorrow text-muted-foreground inline-flex justify-between text-[0.7rem] uppercase">
          <p>Made by LuanRoger - Based in Brazil 🇧🇷</p>
          <p>Powered by Electron</p>
        </footer>
      </div>
    </>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
});
