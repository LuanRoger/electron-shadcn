import React from "react";
import ToggleTheme from "@/components/ToggleTheme";

export default function HomePage() {
    return (
        <>
            <div className="flex h-screen flex-col items-center justify-center gap-2">
                <h1 className="text-4xl font-bold">Home Page</h1>
                <ToggleTheme />
            </div>
        </>
    );
}
