import { os } from "@orpc/server";

export const currentPlatfom = os.handler(() => {
  return process.platform;
});
