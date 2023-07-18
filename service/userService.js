const UserRepository = require('../repositories/userRepository');
const MakeError = require('../utils/makeErrorUtil');

class UserService {
  userRepository = new UserRepository();
  getUser = async () => {};
  createUser = async (
    email,
    name,
    password,
    confirmpassword,
    isPetSitter,
    profilImage,
  ) => {
    try {
      const foundEmail = await this.userRepository.findUser({ email: email }, [
        'email',
      ]);
      if (foundEmail) {
        throw new MakeError(400, '중복된 이메일입니다.', 'invalid request');
      }
      if (!name || !password || !email || !isPetSitter || !confirmpassword) {
        throw new MakeError(
          400,
          '모든 필수 항목을 입력해주셔야 합니다.',
          'invalid request',
        );
      }
      if (email.indexOf('@') == -1) {
        throw new MakeError(
          400,
          '이메일 형식이 올바르지 않습니다.',
          'invalid request',
        );
      }
      if (password !== confirmpassword) {
        throw new MakeError(
          400,
          '패스워드와 패스워드 확인 값이 일치하지 않습니다.',
          'invalid request',
        );
      }
      if (!password.match(/^(?=.*[a-zA-Z])(?=.*[0-9]).{4,8}$/)) {
        throw new MakeError(
          400,
          '패스워드는 대소문자 영어와 숫자를 포함하여 4-8자리로 설정해주세요.',
          'invalid request',
        );
      }
      return this.userRepository.createUser(
        email,
        name,
        password,
        isPetSitter,
        profilImage,
      );
    } catch (err) {
      throw err;
    }
  };
}
module.exports = UserService;
