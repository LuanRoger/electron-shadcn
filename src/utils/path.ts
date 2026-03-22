/** biome-ignore-all lint/style/noNestedTernary: Dynamic get path for ES modules or CommonJS */
/** biome-ignore-all lint/correctness/noGlobalDirnameFilename: Dynamic get path for ES modules or CommonJS */
import path from "node:path";
import { fileURLToPath } from "node:url";

export function getBasePath() {
  return typeof import.meta !== "undefined" && import.meta.url
    ? path.dirname(fileURLToPath(import.meta.url))
    : typeof __dirname === "undefined"
      ? process.cwd()
      : __dirname;
}
