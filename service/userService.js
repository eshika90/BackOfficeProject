const UserRepository = require('../repositories/userRepository');
class UserService {
  userRepository = new UserRepository();
  createUser = async (email, name, password, isPetSitter, profilImage) => {
    console.log('여긴서비스', name);
    return this.userRepository.createUser(
      email,
      name,
      password,
      isPetSitter,
      profilImage,
    );
  };
}
module.exports = UserService;
