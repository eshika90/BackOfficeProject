class MakeError extends Error {
  constructor(code, message, name) {
    super(message);
    this.code = code;
    this.name = name;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = MakeError;
