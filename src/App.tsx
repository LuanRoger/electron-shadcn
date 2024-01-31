import React from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./pages/HomePage";
import BaseLayout from "./layouts/BaseLayout";

export default function App() {
    return (
        <BaseLayout>
            <HomePage />
        </BaseLayout>
    );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);
