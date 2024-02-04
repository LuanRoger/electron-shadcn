import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./pages/HomePage";
import BaseLayout from "./layouts/BaseLayout";
import { setThemeToDefault } from "./helpers/theme_helpers";

export default function App() {
    useEffect(() => {
        setThemeToDefault();
    }, []);

    return (
        <BaseLayout>
            <HomePage />
        </BaseLayout>
    );
}

const root = createRoot(document.getElementById("app")!);
root.render(<App />);
