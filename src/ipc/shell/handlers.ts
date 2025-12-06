import { os } from "@orpc/server";
import { openExternalLinkInputSchema } from "./schemas";
import { shell } from "electron";

export const openExternalLink = os
  .input(openExternalLinkInputSchema)
  .handler(async ({ input }) => {
    const { url } = input;
    shell.openExternal(url);
  });
