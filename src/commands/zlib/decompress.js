import fs from "node:fs";
import path from "node:path";
import stream from "node:stream/promises";
import zlib from "node:zlib";

import { createInputError, createOperationError } from "../../utils/index.js";

export default async function decompress({ state, args }) {
  const [from = "", to = ""] = args;
  if (!from || !to) {
    throw createInputError("the source and destination paths are required");
  }

  const archivePath = path.resolve(state.workdir, from);
  const filePath = path.resolve(state.workdir, to);
  try {
    fs.promises.access(archivePath);
  } catch (error) {
    throw createInputError("the file is not accessible");
  }

  try {
    await stream.pipeline(
      fs.createReadStream(archivePath),
      zlib.createBrotliDecompress(),
      fs.createWriteStream(filePath)
    );
  } catch (error) {
    throw createOperationError();
  }
}
