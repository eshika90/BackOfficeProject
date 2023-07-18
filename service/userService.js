const UserRepository = require('../repositories/userRepository');
class UserService {
  userRepository = new UserRepository();
}
module.exports = UserService;
