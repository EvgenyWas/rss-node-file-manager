import { EOL, cpus, homedir, userInfo } from "node:os";

import { createInputError, createOperationError } from "../../utils/index.js";

const OS_COMMANDS = {
  EOL: () => console.log(JSON.stringify(EOL)),
  cpus: () => {
    console.log(`Number of CPUs: ${cpus().length}`);
    console.table(
      cpus().map(({ model, speed }) => ({
        Model: model,
        "Speed (GHz)": (speed / 1000).toFixed(2),
      }))
    );
  },
  homedir: () => console.log(homedir()),
  username: () => console.log(userInfo().username),
  architecture: () => console.log(process.arch),
};

const allCommands = Object.keys(OS_COMMANDS).reduce(
  (acc, name) => (acc += ` --${name}`),
  ""
);

export default function os({ args }) {
  const [command = ""] = args;
  const handler = OS_COMMANDS[command.replace("--", "")];
  if (handler) {
    try {
      handler();
    } catch (error) {
      throw createOperationError();
    }
  } else {
    throw createInputError(
      `the command is not found, use one of the following:${allCommands}`
    );
  }
}
