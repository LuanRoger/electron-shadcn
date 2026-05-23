import { os } from "@orpc/server";
import { app } from "electron";

export const currentPlatfom = os.handler(() => process.platform);

export const appVersion = os.handler(() => app.getVersion());
