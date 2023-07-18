const UserService = require('../service/userService');
class UserController {
  userService = new UserService();
}
module.exports = UserController;
