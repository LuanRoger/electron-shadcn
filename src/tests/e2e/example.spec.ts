import { test, expect, _electron as electron, ElectronApplication } from "@playwright/test";
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers";

/*
 * Using Playwright with Electron:
 * https://www.electronjs.org/pt/docs/latest/tutorial/automated-testing#using-playwright
 */

var electronApp: ElectronApplication;

test.beforeAll(async () => {
    const latestBuild = findLatestBuild();
    const appInfo = parseElectronApp(latestBuild);
    process.env.CI = "e2e";
    electronApp = await electron.launch({
        args: [appInfo.main],
        executablePath: appInfo.executable,
    });
    electronApp.on("window", async (page) => {
        const filename = page.url()?.split("/").pop();
        console.log(`Window opened: ${filename}`);

        // capture errors
        page.on("pageerror", (error) => {
            console.error(error);
        });
        // capture console messages
        page.on("console", (msg) => {
            console.log(msg.text());
        });
    });
});

test("renders the first page", async () => {
    const page = await electronApp.firstWindow();
    await page.waitForSelector("h1");
    const text = await page.$eval("h1", (el) => el.textContent);
    expect(text).toBe("Home Page");
});
