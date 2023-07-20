const UserService = require('../service/userService');
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
    const userData = await this.userService.login(email, password);
    if (userData) {
      res.cookie('accessToken', `${userData.accessToken}`);
      res.cookie('refreshToken', `Bearer ${userData.refreshToken}`);
      res.status(200).json({ message: '로그인에 성공하였습니다.' });
    }
  };
}
module.exports = UserController;
