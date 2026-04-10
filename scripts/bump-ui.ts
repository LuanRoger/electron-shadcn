#!/usr/bin/env ts-node

import { spawn } from "node:child_process";
import { readdir } from "node:fs/promises";

const DEFAULT_UI_PATH = "src/components/ui";
const DEFAULT_EXECUTOR = "npx";
const COMPONENT_EXTENSION = ".tsx";

async function getComponentsNames(uiPath?: string) {
  const files = await readdir(uiPath ?? DEFAULT_UI_PATH);

  const componentsFilesName = files.filter((fileName) =>
    fileName.endsWith(COMPONENT_EXTENSION)
  );
  const rawComponentNames = componentsFilesName.map((fileName) =>
    fileName.replace(COMPONENT_EXTENSION, "")
  );

  return rawComponentNames;
}

function mountInstallShadcnInstallCommand(components: string[]) {
  const baseCommand = "shadcn@latest add -y -o";
  const installCommand = `${baseCommand} ${components.join(" ")}`;

  return installCommand.split(" ");
}

function spawnCrossPlatformChild(command: string, args: string[]) {
  const isWindows = process.platform === "win32";
  const exec = isWindows ? "cmd" : command;
  const execArgs = isWindows ? ["/c", command, ...args] : args;

  return spawn(exec, execArgs);
}

function runCommand(commandArgs: string[]) {
  const child = spawnCrossPlatformChild(DEFAULT_EXECUTOR, commandArgs);
  child.stdout.on("data", (data) => {
    process.stdout.write(data);
  });

  child.stderr.on("data", (data) => {
    process.stderr.write(data);
  });

  child.on("error", (err) => {
    console.error("Failed to start process:", err);
  });

  return new Promise<void>((resolve, reject) => {
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const uiPath: string | undefined = args[0];
  const installedComponents = await getComponentsNames(uiPath);
  const installCommand = mountInstallShadcnInstallCommand(installedComponents);
  await runCommand(installCommand);
}

main().catch(console.error);
