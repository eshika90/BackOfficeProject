const UserRepository = require('../repositories/userRepository');
const MakeError = require('../utils/makeErrorUtil');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { secretKey, expireIn, expireIn2 } = require('../config').jwt;

class UserService {
  userRepository = new UserRepository();
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
        'refreshToken',
        'id',
      ]);
      if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
        throw new MakeError(
          400,
          '이메일이나 패스워드를 확인해주세요.',
          'invalid request',
        );
      }
      let refreshToken;
      if (!foundUser.refreshToken) {
        refreshToken =
          'Bearer ' + jwt.sign({}, secretKey, { expiresIn: expireIn2 });
        await this.userRepository.saveRefreshtoken(email, refreshToken);
      }
      if (foundUser.refreshToken) {
        refreshToken = foundUser.refreshToken;
      }
      const accessToken =
        'Bearer ' +
        jwt.sign({ userId: foundUser.id }, secretKey, {
          expiresIn: expireIn,
        });
      console.log(refreshToken);
      return { accessToken, refreshToken };
    } catch (err) {
      throw err;
    }
  };
  getUser = async (object, arr = []) => {
    try {
      if (arr.indexOf('password') !== -1) {
        throw new MakeError(
          400,
          'password는 요청할 수 없습니다',
          'invalid request err',
        );
      }
      if (!Object.keys(object).length) {
        throw new MakeError(
          400,
          '검색 조건이 누락되었습니다',
          'invalid request err',
        );
      }
      const user = await this.userRepository.findUser(object, arr);
      if (!user) {
        throw new MakeError(
          404,
          '유저 정보를 찾을 수 없습니다.',
          'invalid request err',
        );
      }
      return user;
    } catch (err) {
      throw err;
    }
  };

  modifyUserPass = async (
    payloadData,
    confirmpassword,
    password,
    updatepassword,
  ) => {
    const userId = payloadData.userId;
    const foundUser = await this.userRepository.findUser({ id: userId }, [
      'password',
    ]);
    try {
      if (!password.match(/^(?=.*[a-zA-Z])(?=.*[0-9]).{4,8}$/)) {
        throw new MakeError(
          400,
          '패스워드 형식이 올바르지 않습니다.',
          'invalid request',
        );
      }
      if (!updatepassword.match(/^(?=.*[a-zA-Z])(?=.*[0-9]).{4,8}$/)) {
        throw new MakeError(
          400,
          '변경할 패스워드 형식이 올바르지 않습니다.',
          'invalid request',
        );
      }
      if (password !== confirmpassword) {
        const error = new MakeError(
          400,
          '패스워드와 패스워드 확인 값이 일치하지 않습니다.',
          'invalid request',
        );
      }
      if (password == updatepassword) {
        throw new MakeError(
          400,
          '변경할 패스워드와 현재 패스워드가 같습니다.',
          'invalid request',
        );
      }
      if (!bcrypt.compareSync(password, foundUser.password)) {
        throw new MakeError(
          400,
          '입력하신 패스워드가 기존 패스워드와 다릅니다.',
          'invalid request',
        );
      }
      const updateHashPass = { password: bcrypt.hashSync(updatepassword, 10) };
      return await this.userRepository.updateUser(userId, updateHashPass);
    } catch (err) {
      throw err;
    }
  };
  modifyUserInfo = async (payloadData, profileImage) => {
    const userId = payloadData.userId;
    const updateImg = { profileImage };
    return await this.userRepository.updateUser(userId, updateImg);
  };
}
module.exports = UserService;
