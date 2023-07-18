const { Users } = require('../models');
class UserRepository {
  createUser = async (email, name, password, isPetSitter, profileImage) => {
    const createUserData = await Users.create({
      email,
      name,
      password,
      isPetSitter,
      profileImage,
    });
    console.log('여긴repo', name);
    return createUserData;
  };
}

module.exports = UserRepository;
