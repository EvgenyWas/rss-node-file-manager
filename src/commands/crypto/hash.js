import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import stream from "node:stream/promises";

import { createInputError, createOperationError } from "../../utils/index.js";

export default async function hash({ state, args }) {
  const [userPath] = args;
  if (!userPath) {
    throw createInputError();
  }

  const targetPath = path.resolve(state.workdir, userPath);
  let lstat;
  try {
    lstat = await fs.promises.lstat(targetPath);
  } catch (error) {
    throw createInputError("the file path is not correct");
  }

  if (!lstat.isFile()) {
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
