import fs from "node:fs/promises";
import path from "node:path";

import {
  createInputError,
  createOperationError,
  absent,
} from "../../utils/index.js";

export default async function rn({ state, args }) {
  const [oldOne, newOne] = args;
  if (!oldOne || !newOne) {
    throw createInputError(
      "the path to file and the new file name are required"
    );
  }

  const oldPath = path.resolve(state.workdir, oldOne);
  const newPath = path.resolve(state.workdir, newOne);
  try {
    await Promise.all([absent(newPath), fs.access(oldPath)]);
  } catch (error) {
    throw createInputError(
      "the file is not accessible or the file already exists with the new filename"
    );
  }

  try {
    await fs.rename(oldPath, newPath);
  } catch (error) {
    throw createOperationError();
  }
}
