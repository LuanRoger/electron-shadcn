import { ipc } from "@/ipc/manager";

export function getPlatform() {
  return ipc.client.platform.currentPlatfom();
}
