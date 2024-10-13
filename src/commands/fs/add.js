import fs from "node:fs/promises";
import path from "node:path";

import { createInputError, createOperationError } from "../../utils/index.js";

export default async function add({ state, args }) {
  const [newFileName] = args;
  if (!newFileName) {
    throw createInputError("the file path is required");
  }

  const targetPath = path.resolve(state.workdir, newFileName);
  try {
    await fs.writeFile(targetPath, "", { flag: "wx" });
  } catch (error) {
    throw createOperationError();
  }
}
