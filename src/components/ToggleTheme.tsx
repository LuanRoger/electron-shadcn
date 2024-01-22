import { Moon } from "lucide-react";
import React from "react";

export default function ToggleTheme() {
    function toggleTheme() {
        const isDarkMode = document.documentElement.classList.contains("dark");
        if (isDarkMode) {
            document.documentElement.classList.remove("dark");
        } else {
            document.documentElement.classList.add("dark");
        }
    }

    return (
        <button type="button" title="Toggle theme" onClick={toggleTheme}
        className="ring-0 p-2 border rounded-md bg-muted hover:bg-muted-foreground transition-colors"
        >
            <Moon size={16}/>
        </button>
    )
}