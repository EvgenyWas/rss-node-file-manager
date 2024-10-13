export class FileManagerError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
}

export function createInputError(reason) {
  return new FileManagerError(0, `Invalid input${reason ? ": " + reason : ""}`);
}

export function createOperationError(reason) {
  return new FileManagerError(
    1,
    `Operation failed${reason ? ": " + reason : ""}`
  );
}

export function isFileManagerError(value) {
  return value instanceof FileManagerError;
}
