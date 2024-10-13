import { cp, rm } from "./index.js";

export default async function mv() {
  await cp(...arguments);
  await rm(...arguments);
}
