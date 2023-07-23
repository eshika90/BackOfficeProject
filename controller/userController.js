const UserService = require('../service/userService');
const MakeError = require('../utils/makeErrorUtil');
class UserController {
  userService = new UserService();
  mailVerify = async (req, res, next) => {
    try {
      const { email } = req.body;
      await this.userService.mailVerify(email);
      return res
        .status(200)
        .json({ message: '이메일로 인증번호가 전송되었습니다!' });
    } catch (err) {
      if (err instanceof MakeError) {
        return res.status(err.code).json({ message: err.message });
      }
      return res.status(500).json({ message: 'Server Error' });
    }
  };
  mailCodeVerify = async (req, res, next) => {
    try {
      const { email, code } = req.body;
      const codeConfirm = await this.userService.mailCodeVerify(email, Number(code));
      if (codeConfirm) {
        return res
          .status(200)
          .json({ message: '이메일 인증이 완료되었습니다!' });
      }
    } catch (err) {
      if (err instanceof MakeError) {
        return res.status(err.code).json({ message: err.message });
      }
<<<<<<< Updated upstream
      console.log(err);
=======
>>>>>>> Stashed changes
      return res.status(500).json({ message: 'Server Error' });
    }
  };
  createUser = async (req, res, next) => {
<<<<<<< Updated upstream
    const {
      email,
      name,
      password,
      confirmpassword,
      isPetSitter,
      profileImage,
    } = req.body;
    console.log(req.body);
=======
>>>>>>> Stashed changes
    try {
      const {
        email,
        name,
        password,
        confirmpassword,
        isPetSitter,
        profileImage,
      } = req.body;
      const createUserData = await this.userService.createUser(
        email,
        name,
        password,
        confirmpassword,
        isPetSitter,
        profileImage,
      );

      return res.status(201).json({ message: '회원 가입에 성공하였습니다.' });
    } catch (err) {
<<<<<<< Updated upstream
      if (err.code) {
=======
      if (err instanceof MakeError) {
>>>>>>> Stashed changes
        return res.status(err.code).json({ message: err.message });
      } else {
        return res.status(500).json({ message: 'Server Error' });
      }
    }
  };
  login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const userData = await this.userService.login(email, password);
      if (userData) {
        res.cookie('accessToken', `Bearer ${userData.accessToken}`, { httpOnly: true });
        res.cookie('refreshToken', `Bearer ${userData.refreshToken}`, { httpOnly: true });
        res.status(200).json({ message: '로그인에 성공하였습니다.' });
      }
    } catch (err) {
      if (err instanceof MakeError) {
        return res.status(err.code).json({ message: err.message });
<<<<<<< Updated upstream
      }
      return res.status(500).json({ message: 'Server Error' });
    }
  };
  logout = async (req, res, next) => {
    try {
      res.clearCookie('accessToken', 'refreshToken');
      res.status(200).json({ message: '로그아웃 하였습니다.' });
    } catch (err) {
      if (err instanceof MakeError) {
        return res.status(err.code).json({ message: err.message });
      }
      return res.status(500).json({ message: 'Server Error' });
=======
      } else {
        return res.status(500).json({ message: 'Server Error' });
      }
>>>>>>> Stashed changes
    }
  };
  showUserInfo = async (req, res, next) => {
    try {
      const payloadData = res.locals.payload;
      const userInfo = ['email', 'name', 'isPetSitter', 'profileImage'];
      const foundUserInfos = await this.userService.getUser(
        { id: payloadData.userId },
        userInfo,
      );
      return res.status(200).json({ 'Users detail': foundUserInfos });
    } catch (err) {
      if (err instanceof MakeError) {
        return res.status(err.code).json({ message: err.message });
      } else {
        return res.status(500).json({ message: 'Server Error' });
      }
    }
  };
  modifyUserPass = async (req, res, next) => {
    try {
      const payloadData = res.locals.payload;
      const { password, confirmpassword, updatepassword } = req.body;
      await this.userService.modifyUserPass(
        payloadData,
        password,
        confirmpassword,
        updatepassword,
      );
      return res.status(200).json({ message: '비밀번호를 수정하였습니다.' });
    } catch (err) {
      if (err instanceof MakeError) {
        return res.status(err.code).json({ message: err.message });
<<<<<<< Updated upstream
      }
      return res.status(500).json({ message: 'Server Error' });
=======
      } else {
        return res.status(500).json({ message: 'Server Error' });
      }
>>>>>>> Stashed changes
    }
  };
  modifyUserInfo = async (req, res, next) => {
    const payloadData = res.locals.payload;
    const { profileImage } = req.body;
    try {
      const updateUserInfo = await this.userService.modifyUserInfo(
        payloadData,
        profileImage,
      );
      return res.status(200).json({ message: '회원 정보를 수정하였습니다.' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server Error' });
    }
  };
}
module.exports = UserController;
