import fs from "node:fs";
import stream from "node:stream/promises";
import path from "node:path";

import { createInputError, createOperationError } from "../../utils/index.js";

export default async function cp({ state, args }) {
  const [src, directory] = args;
  if (!src || !directory) {
    throw createInputError(
      "the source path and the destination path are required"
    );
  }

  const srcPath = path.resolve(state.workdir, src);
  const directoryPath = path.resolve(state.workdir, directory);
  try {
    const stat = await fs.promises.stat(directoryPath);
    if (!stat.isDirectory()) {
      throw new Error("not a directory");
    }
  } catch (error) {
    throw createInputError("the destination path is not a directory");
  }

  try {
    await fs.promises.access(srcPath);
  } catch (error) {
    throw createInputError("the file to copy is not accessible");
  }

  try {
    await stream.pipeline(
      fs.createReadStream(srcPath),
      fs.createWriteStream(path.join(directoryPath, path.basename(srcPath)))
    );
  } catch (error) {
    throw createOperationError();
  }
}
