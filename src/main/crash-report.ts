import { app, BrowserWindow, dialog, shell } from "electron";
import { Logger } from "./logger";

const getIssuesUrl = (): string => {
  const repo =
    typeof process.env.GITHUB_REPO === "string"
      ? process.env.GITHUB_REPO
      : "shipkit-io/bones";
  return `https://github.com/${repo}/issues/new`;
};

const buildIssueUrl = (error: Error): string => {
  const title = `Crash: ${error.message.split("\n")[0]}`;
  const body = [
    "## Error",
    "```",
    error.stack ?? error.message,
    "```",
    "",
    "## Environment",
    "```",
    `${app.getName()} ${app.getVersion()}`,
    `Electron ${process.versions.electron}`,
    `${process.platform} ${require("node:os").release()}`,
    "```",
  ].join("\n");

  const params = new URLSearchParams({ title, body });
  return `${getIssuesUrl()}?${params.toString()}`;
};

export const showCrashReportDialog = async (error: Error): Promise<void> => {
  try {
    const { response } = await dialog.showMessageBox({
      type: "error",
      title: `${app.name} encountered an error`,
      message: error.message,
      detail: error.stack,
      buttons: ["Report Issue", "Restart", "Quit"],
      defaultId: 0,
      cancelId: 2,
      noLink: true,
    });

    if (response === 0) {
      shell.openExternal(buildIssueUrl(error));
    } else if (response === 1) {
      app.relaunch();
      app.quit();
    } else {
      app.quit();
    }
  } catch (dialogError) {
    Logger.error("Failed to show crash report dialog:", dialogError);
    app.quit();
  }
};

export const wireRenderProcessGone = (win: BrowserWindow): void => {
  win.webContents.on("render-process-gone", (_event, details) => {
    Logger.error("Render process gone:", details);
    const error = new Error(
      `Render process gone: ${details.reason}${details.exitCode !== undefined ? ` (exit code ${details.exitCode})` : ""}`,
    );
    showCrashReportDialog(error);
  });
};

export const installCrashHandlers = (): void => {
  process.on("uncaughtException", (error: Error) => {
    Logger.error("Uncaught exception:", error);
    showCrashReportDialog(error);
  });

  process.on("unhandledRejection", (reason: unknown) => {
    Logger.error("Unhandled rejection:", reason);
    const error = reason instanceof Error ? reason : new Error(String(reason));
    showCrashReportDialog(error);
  });

  app.on("child-process-gone", (_event, details) => {
    Logger.error("Child process gone:", details);
    const error = new Error(
      `Child process gone (${details.type}): ${details.reason}`,
    );
    showCrashReportDialog(error);
  });
};
