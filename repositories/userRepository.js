const User = require('../models/users');
class UserRepository {
  findUser = async (id) => {};
  createUser = async (userdata) => {
    const createUserData = await User.create({});
  };
  login = async (email, password) => {};
}

module.exports = UserRepository;
