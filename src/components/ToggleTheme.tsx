import { Moon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { updateDocumentTheme } from "@/helpers/theme_helpers";

export default function ToggleTheme() {
    async function toggleTheme() {
        const isDarkMode = await window.themeMode.toggle();
        updateDocumentTheme(isDarkMode);
    }

    return (
        <Button onClick={toggleTheme} size="icon">
            <Moon size={16} />
        </Button>
    );
}
