class MakeError extends Error {
  constructor(code, message, name) {
    super(message);
    this.code = code;
    this.name = name;
  }
}

// // throw new MakeError(401, '올바른 postId를 입력해주세요', 'invalid postId');
