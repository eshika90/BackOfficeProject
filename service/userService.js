const UserRepository = require('../repositories/userRepository');
const MakeError = require('../utils/makeErrorUtil');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { secretKey, expireIn, expireIn2 } = require('../config').jwt;

const {
  MailSender,
  codeObject,
  isEmailVerified,
} = require('../nodemailer/nodemailer');

class UserService {
  userRepository = new UserRepository();
  mailSender = new MailSender();
  mailVerify = async (email) => {
    try {
      const isEmail = await this.userRepository.findUser({ email: email });
      if (isEmail) {
        throw new MakeError(400, '중복되는 이메일입니다.', 'invalid request');
      }
      await this.mailSender.sendKaKaoemail(email);
      setTimeout(() => {
        delete codeObject[email];
      }, 180000);
      return true;
    } catch (err) {
      throw err;
    }
  };
  mailCodeVerify = async (email, code) => {
    try {
      if (codeObject[email] && codeObject[email] == code) {
        isEmailVerified[email] = true;
        return true;
      } else {
        throw new MakeError( // 코드를 클라이언트가 실수로 잘 못 입력하였을 경우
          400,
          '보낸 코드와 일치하지 않습니다.',
          'invalid request',
        );
      }
    } catch (err) {
      throw err;
    }
  };
  createUser = async (
    email,
    name,
    password,
    confirmpassword,
    isPetSitter,
    profilImage,
  ) => {
    try {
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
      if (!isEmailVerified[email]) {
        throw new MakeError(
          401,
          '이메일 인증을 완료해주세요',
          'invalid email verify',
        );
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      delete isEmailVerified[email];
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
        'id',
      ]);
      if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
        throw new MakeError(
          400,
          '이메일이나 패스워드를 확인해주세요.',
          'invalid request',
        );
      }
      let refreshToken = jwt.sign({}, secretKey, { expiresIn: expireIn2 });
      await this.userRepository.saveRefreshtoken(email, refreshToken);
      const accessToken = jwt.sign({ userId: foundUser.id }, secretKey, {
        expiresIn: expireIn,
      });
      return { accessToken, refreshToken };
    } catch (err) {
      console.log(err);
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
    password,
    confirmpassword,
    updatepassword,
  ) => {
    try {
      const userId = payloadData.userId;
      const foundUser = await this.userRepository.findUser({ id: userId }, [
        'password',
      ]);
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
      if (updatepassword !== confirmpassword) {
        throw new MakeError(
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
    try {
      return await this.userRepository.updateUser(userId, updateImg);
    } catch (err) {
      throw err;
    }
  };
}
module.exports = UserService;
