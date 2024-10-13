import path from "node:path";

export default function up({ state }) {
  return { workdir: path.resolve(state.workdir, "..") };
}
