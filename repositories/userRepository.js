const { Users } = require('../models');
class UserRepository {
  findUser = async (object, arr) => {
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
  updateUser = async (id, updateColumn) => {
    const updateUserData = await Users.update(updateColumn, { where: { id } });
    return updateUserData;
  };
}

module.exports = UserRepository;
