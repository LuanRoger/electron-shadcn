import React from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  NavigationMenu as NavigationMenuBase,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { DatabaseIndicator } from "../DatabaseIndicator";

export default function NavigationMenu() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between w-full">
      <NavigationMenuBase className="px-2 font-mono text-muted-foreground">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {t("titleHomePage")}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/second-page">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {t("titleSecondPage")}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/transactions">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Transactions
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenuBase>

      <DatabaseIndicator />
    </div>
  );
}
