import fs from "node:fs";
import { spawnSync } from "node:child_process";
for (const directory of [".next/types", ".next/dev/types"])
  fs.rmSync(directory, { recursive: true, force: true });
for (const [script, args] of [
  ["scripts/sync-routes.mjs", []],
  ["node_modules/next/dist/bin/next", ["typegen"]],
  ["node_modules/typescript/bin/tsc", ["--noEmit"]],
]) {
  const result = spawnSync(process.execPath, [script, ...args], {
    stdio: "inherit",
  });
  if (result.status) process.exit(result.status || 1);
}
