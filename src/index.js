import os from "node:os";
import { createInterface } from "node:readline/promises";

import * as commands from "./commands/index.js";
import * as systemCommands from "./commands/system/index.js";
import {
  createInputError,
  debounce,
  extractArgs,
  getUsername,
  isFileManagerError,
} from "./utils/index.js";

function defineHandler(command, rl) {
  const isSystemCommand = Boolean(command?.startsWith("."));
  const handler = isSystemCommand
    ? systemCommands[command.substring(1)]
    : commands[command];

  if (!handler) {
    return null;
  }

  return isSystemCommand ? handler.bind(null, rl) : handler;
}

async function runFileManager() {
  const initialArgs = process.argv.slice(2);
  const state = Object.seal({
    workdir: os.homedir(),
    username: getUsername(initialArgs),
  });
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    removeHistoryDuplicates: true,
  });

  rl.on(
    "line",
    debounce(async (line) => {
      const [command, ...args] = extractArgs(line);
      try {
        const handler = defineHandler(command, rl);
        if (handler) {
          const updatedState = await handler({ state, args });
          Object.assign(state, updatedState ?? {});
        } else {
          throw createInputError(`the command "${command}" doesn't exist`);
        }
      } catch (error) {
        console.log(isFileManagerError(error) ? error.message : error);
      } finally {
        console.log(`You are currently in ${state.workdir}`);
      }

      rl.prompt();
    }, 200)
  ).on("close", () => {
    console.log(
      `Thank you for using File Manager, ${state.username}, goodbye!`
    );
    process.exit(0);
  });

  console.log(`Welcome to the File Manager, ${state.username}!`);
}

runFileManager();
