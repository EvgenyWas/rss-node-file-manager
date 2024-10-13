import path from "node:path";
import fs from "node:fs/promises";

import { createInputError } from "../../utils/index.js";

export default async function cd({ state, args }) {
  const [nextPath] = args;
  if (!nextPath) {
    throw createInputError("the path to a directory is mandatory");
  }

  const nextWorkdir = path.resolve(state.workdir, nextPath);
  let stat;
  try {
    stat = await fs.stat(nextWorkdir);
  } catch (error) {
    throw createInputError("the path doesn't exist");
  }

  if (!stat.isDirectory()) {
    throw createInputError("the path is not a directory");
  }

  return { workdir: nextWorkdir };
}
