import ToggleTheme from "@/components/toggle-theme";
import { useTranslation } from "react-i18next";
import LangToggle from "@/components/lang-toggle";
import { createFileRoute } from "@tanstack/react-router";
import { SiElectron, SiReact, SiVite } from "@icons-pack/react-simple-icons";
import NavigationMenu from "@/components/navigation-menu";
import { getAppVersion } from "@/actions/app";
import { useEffect, useState, useTransition } from "react";
import ExternalLink from "@/components/external-link";

/*
 * Update this page to modify your home page.
 * You can delete this file component to start from a blank page.
 */

function HomePage() {
  const iconSize = 48;

  const [appVersion, setAppVersion] = useState("0.0.0");
  const [, startGetAppVersion] = useTransition();
  const { t } = useTranslation();

  useEffect(
    () => startGetAppVersion(() => getAppVersion().then(setAppVersion)),
    [],
  );

  return (
    <>
      <NavigationMenu />
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex flex-col items-end justify-center gap-0.5">
          <div className="inline-flex gap-2">
            <SiReact size={iconSize} />
            <SiVite size={iconSize} />
            <SiElectron size={iconSize} />
          </div>
          <span className="flex items-end justify-end">
            <h1 className="font-mono text-4xl font-bold">{t("appName")}</h1>
            <p className="text-muted-foreground text-sm">v{appVersion}</p>
          </span>
          <div className="flex w-full justify-between">
            <ExternalLink
              href="https://github.com/LuanRoger"
              className="text-muted-foreground flex gap-2 text-sm"
            >
              {t("madeBy")}
            </ExternalLink>
            <div className="flex items-center gap-2">
              <LangToggle />
              <ToggleTheme />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
});
