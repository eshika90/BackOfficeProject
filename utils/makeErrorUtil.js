class MakeError extends Error {
  constructor(code, message, name) {
    super(message);
    this.code = code;
    this.name = name;
  }
  sendErrorResponse(res) {
    res.status(this.code).json({ message: this.message, name: this.name });
  }
}

module.exports = MakeError;
