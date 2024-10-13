import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import stream from "node:stream/promises";

import { createInputError, createOperationError } from "../../utils/index.js";

export default async function hash({ state, args }) {
  const [src] = args;
  if (!src) {
    throw createInputError("the path to a file is required");
  }

  const targetPath = path.resolve(state.workdir, src);
  let stat;
  try {
    stat = await fs.promises.stat(targetPath);
  } catch (error) {
    throw createInputError("the file path is not correct");
  }

  if (!stat.isFile()) {
    throw createInputError("the path is not a file");
  }

  let result;
  try {
    await stream.pipeline(
      fs.createReadStream(targetPath),
      crypto.createHash("sha256").setEncoding("hex"),
      async (source) => {
        result = (await source.toArray())[0];
      }
    );
  } catch (error) {
    throw createOperationError();
  }

  console.log(result);
}
