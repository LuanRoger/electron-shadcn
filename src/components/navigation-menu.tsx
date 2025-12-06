import { Link } from "@tanstack/react-router";
import {
  NavigationMenu as NavigationMenuBase,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useTranslation } from "react-i18next";
import ExternalLink from "./external-link";

export default function NavigationMenu() {
  const { t } = useTranslation();

  return (
    <NavigationMenuBase className="text-muted-foreground px-2">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/">{t("titleHomePage")}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/second">{t("titleSecondPage")}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <ExternalLink href="https://docs.luanroger.dev/electron-shadcn">
              {t("documentation")}
            </ExternalLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenuBase>
  );
}
