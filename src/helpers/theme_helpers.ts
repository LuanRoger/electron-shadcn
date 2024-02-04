export async function setThemeToDefault() {
    const isDarkMode = await window.themeMode.system();
    updateDocumentTheme(isDarkMode);
}

export function updateDocumentTheme(isDarkMode: boolean) {
    if (!isDarkMode) {
        document.documentElement.classList.remove("dark");
    } else {
        document.documentElement.classList.add("dark");
    }
}