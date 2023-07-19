const { Users } = require('../models');
class UserRepository {
  // findUser를 사용할 때
  // 1) 로그인 후 마이페이지를 들어가서 사용자 정보를 가져올 때
  // 2) accesstoken이 만료되어서 db에서 refreshtoken을 찾아야 할 때
  // 3) 중복되는 email이 있을 때
  // 1) 경우에는 로그인이 되었기 때문에 req : id를 가져와서 찾으면 됨
  // 2) 의 경우에는 accesstoken에 id정보가 없기때문에 req : refreshtoken으로 받아와야함

  findUser = async (object, arr) => {
    // email service  findOne(email, data)??? service (data)
    const userResult = await Users.findOne({
      where: object,
      attributes: arr,
    });
    return userResult;
  };
  createUser = async (
    email,
    name,
    hashedPassword,
    isPetSitter,
    profileImage,
  ) => {
    const createUserData = await Users.create({
      email,
      name,
      password: hashedPassword,
      isPetSitter,
      profileImage,
    });
    return createUserData;
  };
  saveRefreshtoken = async (email, refreshToken) => {
    const savedRefreshToken = await Users.update(
      { refreshToken },
      { where: { email } },
    );
    return savedRefreshToken;
  };
}

module.exports = UserRepository;
