import fs from "node:fs";
import path from "node:path";

import {
  createInputError,
  createOperationError,
  absent,
} from "../../utils/index.js";

export default async function cat({ state, args }) {
  const [src] = args;
  if (!src) {
    throw createInputError("the file path is required");
  }

  const targetPath = path.resolve(state.workdir, src);
  try {
    await fs.promises.access(targetPath);
  } catch (error) {
    throw createInputError("the file doesn't exist");
  }

  const stream = fs.createReadStream(targetPath, { encoding: "utf-8" });
  let data = "";
  stream.on("data", (value) => (data += value.toString()));

  return new Promise((resolve, reject) => {
    stream.on("end", () => {
      console.log(data);
      resolve();
    });
    stream.on("error", () => reject(createOperationError()));
  });
}
