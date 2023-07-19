const UserRepository = require('../repositories/userRepository');
class UserService {
  userRepository = new UserRepository();

  getUser = async (object, arr) => {
    try {
      // password를 가져오는것은 막는게 좋은지?
      if (arr.indexOf('password')) {
        throw new MakeError(
          400,
          'password는 요청할 수 없습니다',
          'invalid request err',
        );
      }
      if (!Object.keys(object).length) {
        throw new MakeError(
          400,
          '검색 조건이 누락되었습니다',
          'invalid request err',
        );
      }
      const user = await this.userRepository.findUser(object, arr);
      if (!user) {
        throw new MakeError(
          404,
          'user가 존재하지 않습니다',
          'user not found err',
        );
      }
      return user;
    } catch (err) {
      throw err;
    }
  };
}
module.exports = UserService;
