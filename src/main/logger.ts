import { app, dialog, shell } from "electron";
import Logger from "electron-log/main";

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

const catchErrors = () => {
  return Logger.errorHandler.startCatching({
    showDialog: false,
    onError({ error, processType }) {
      if (processType === "renderer") {
        Logger.error(error);
        return;
      }

      dialog
        .showMessageBox({
          title: "An error occurred",
          message: error.message,
          detail: error.stack,
          type: "error",
          buttons: ["Ignore", "Report Issue", "Quit"],
        })
        .then((result) => {
          if (result.response === 1) {
            shell.openExternal(buildIssueUrl(error));
            return;
          }
          if (result.response === 2) {
            app.quit();
          }
        })
        .catch((err: Error) => {
          Logger.error(err);
        });
    },
  });
};

export const initializeLogger = () => {
  Logger.initialize({ preload: true });
  Logger.info("Logger initialized");
};

export const initializeErrorHandling = () => {
  catchErrors();
  Logger.info("Error handling initialized");
};

export { Logger };
