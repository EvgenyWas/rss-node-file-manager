import fs from "node:fs/promises";
import path from "node:path";

import { cp, rm } from "./index.js";
import { createInputError } from "../../utils/index.js";

export default async function mv({ state, args }) {
  const [src, dest] = args;
  if (!src || !dest) {
    throw createInputError(
      "the source path and the destination path are required"
    );
  }

  const srcPath = path.resolve(state.workdir, src);
  const destPath = path.resolve(state.workdir, dest);
  // try {
  //   const stat = await fs.lstat(destPath);
  //   if (!stat.isDirectory()) {
  //     throw new Error("not directory");
  //   }
  // } catch (error) {
  //   throw createInputError(
  //     "the destination path doesn't exist or it is not a directory"
  //   );
  // }

  const destFilePath = path.join(destPath, path.basename(srcPath));
  await cp({ state, args: [srcPath, destFilePath] });
  await rm(...arguments);
}
