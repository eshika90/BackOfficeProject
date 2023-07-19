const UserRepository = require('../repositories/userRepository');
const MakeError = require('../utils/makeErrorUtil');
const { authMiddlewareHttp } = require('../middlewares/auth-middleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { secretKey, expireIn, expireIn2 } = require('../config').jwt;

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
      const hashedPassword = bcrypt.hashSync(password, 10);
      return this.userRepository.createUser(
        email,
        name,
        hashedPassword,
        isPetSitter,
        profilImage,
      );
    } catch (err) {
      throw err;
    }
  };
  login = async (email, password) => {
    try {
      if (!email) {
        throw new MakeError(400, '이메일을 입력해주세요.', 'invalid request');
      }
      if (!password) {
        throw new MakeError(400, '비밀번호를 입력해주세요.', 'invalid request');
      }
      if (email.indexOf('@') == -1) {
        throw new MakeError(
          400,
          '이메일 형식이 올바르지 않습니다.',
          'invalid request',
        );
      }
      if (!password.match(/^(?=.*[a-zA-Z])(?=.*[0-9]).{4,8}$/)) {
        throw new MakeError(
          400,
          '비밀번호 형식이 올바르지 않습니다.',
          'invalid request',
        );
      }
      const foundUser = await this.userRepository.findUser({ email: email }, [
        'email',
        'password',
      ]);
      if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
        throw new MakeError(
          400,
          '이메일이나 패스워드를 확인해주세요.',
          'invalid request',
        );
      }
      const accessToken = jwt.sign({ email }, secretKey, {
        expiresIn: expireIn,
      });
      const refreshToken = jwt.sign({}, secretKey, { expiresIn: expireIn2 });
      const savedRefreshToken = await this.userRepository.saveRefreshtoken(
        email,
        refreshToken,
      );
      return { accessToken, savedRefreshToken };
    } catch (err) {
      throw err;
    }
  };
}
module.exports = UserService;
