import { Moon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

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
        <Button onClick={toggleTheme} size="icon">
            <Moon size={16}/>
        </Button>
    )
}