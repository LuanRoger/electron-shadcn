import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    stories: [
        "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
        "../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    ],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-onboarding",
        "@storybook/addon-interactions",
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {
            builder: {
                viteConfigPath: require.resolve("../vite.renderer.config.ts"),
            },
        },
    },
    docs: {
        autodocs: "tag",
    },
};
export default config;
