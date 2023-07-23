class MakeError extends Error {
<<<<<<< Updated upstream
  constructor(code, message, name) {
=======
  constructor(code,message,name) {
>>>>>>> Stashed changes
    super(message);
    this.code = code;
    this.name = name;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = MakeError;
