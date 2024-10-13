import fs from "node:fs/promises";

export function getUsername(args) {
  const username = args
    .find((arg) => arg.startsWith("--username="))
    ?.replace("--username=", "");

  return username || "anonymous";
}

export function extractArgs(value) {
  if (!value) {
    return [];
  }

  const args = value.match(/(?:[^\s"']+|['"][^'"]*['"])+/g);
  if (!args || !args[0]) {
    return [];
  }

  return args.map((arg) => arg.replace(/^['"]|['"]$/g, ""));
}

export function absent(path) {
  return new Promise((resolve, reject) =>
    fs
      .access(path)
      .then(() => reject("the path exists"))
      .catch(resolve)
  );
}

export function debounce(callback, wait = 0) {
  let timeoutId = null;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), wait);
  };
}
