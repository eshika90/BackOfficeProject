const UserService = require('../service/userService');
const { authMiddlewareHttp } = require('../middlewares/auth-middleware.js');
class UserController {
  userService = new UserService();
  createUser = async (req, res, next) => {
    const {
      email,
      name,
      password,
      confirmpassword,
      isPetSitter,
      profileImage,
    } = req.body;
    try {
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
      if (err.code) {
        return res.status(err.code).json({ messge: err.message });
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
        res.cookie('accessToken', `Bearer ${userData.accessToken}`);
        res.cookie('refreshToken', `Bearer ${userData.refreshToken}`);
        res.status(200).json({ message: '로그인에 성공하였습니다.' });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server Error' });
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
      return res.status(500).json({ message: 'Server Error' });
    }
  };
  modifyUserPass = async (req, res, next) => {
    const payloadData = res.locals.payload;
    const { password, confirmpassword, updatepassword } = req.body;
    await this.userService.modifyUserPass(
      payloadData,
      password,
      confirmpassword,
      updatepassword,
    );
    return res.status(200).json({ message: '비밀번호를 수정하였습니다.' });
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
