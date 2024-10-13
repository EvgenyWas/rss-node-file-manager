import fs from "node:fs/promises";
import path from "node:path";

import { createOperationError } from "../../utils/index.js";

const ORDER = { directory: 1, file: 2, unknown: 3 };

function identify(stat) {
  switch (true) {
    case stat.isFile():
      return "file";
    case stat.isDirectory():
      return "directory";
    default:
      return "unknown";
  }
}

export default async function ls({ state }) {
  try {
    const list = await fs.readdir(state.workdir);
    const stats = await Promise.all(
      list.map((item) => fs.stat(path.resolve(state.workdir, item)))
    );
    console.table(
      stats
        .map((item, idx) => ({ Name: list[idx], Type: identify(item) }))
        .sort((a, b) => ORDER[a.Type] - ORDER[b.Type])
    );
  } catch (error) {
    throw createOperationError();
  }
}
