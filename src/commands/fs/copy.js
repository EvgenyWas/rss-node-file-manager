import fs from "node:fs";
import stream from "node:stream/promises";
import path from "node:path";

import {
  createInputError,
  createOperationError,
  absent,
} from "../../utils/index.js";

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
    await fs.promises.access(srcPath);
  } catch (error) {
    throw createInputError("the file to copy is not accessible");
  }

  const readStream = fs.createReadStream(srcPath);
  const writeStream = fs.createWriteStream(
    path.join(directoryPath, path.basename(srcPath))
  );
  try {
    await fs.promises.mkdir(directoryPath, { recursive: true });
    await stream.pipeline(readStream, writeStream);
  } catch (error) {
    throw createOperationError();
  }
}
