import fs from "node:fs/promises";
import path from "node:path";
import { createInputError, createOperationError } from "../../utils/index.js";

export default async function rm({ state, args }) {
  const [value] = args;
  if (!value) {
    throw createInputError("the path to delete is required");
  }

  const targetPath = path.resolve(state.workdir, value);
  try {
    await fs.access(targetPath);
  } catch (error) {
    throw createInputError("the path doesn't exist");
  }

  try {
    await fs.rm(targetPath, { recursive: true });
  } catch (error) {
    throw createOperationError();
  }
}
