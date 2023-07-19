// const jwt = require('jswonwebtoken');
// const UserRepository = require('../repositories/userRepository');
// const cookieParser = require('cookie-parser');
// const variable = require('../config.js');

// {
// }
// const authMiddlewareHttp = async (req, res, next) => {
//   try {
//     const [accessTokenAuthType, accessToken] = (
//       req.cookies.accessToken ?? ''
//     ).split(' ');
//     const [refreshTokenAuthType, refreshToken] = (
//       req.cookies.refreshToken ?? ''
//     ).split('');

//     if (
//       accessTokenAuthType !== 'Bearer' ||
//       !refreshToken ||
//       !accessTokenAuthType !== 'Bearer' ||
//       !accessToken
//     ) {
//       //  throw Error
//       throw new MakeError(
//         401,
//         '올바른 postId를 입력해주세요',
//         'invalid postId',
//       );
//     }
//     res.locals.payload = { userId: 1 };
//   } catch (err) {
//     throw err;
//   }
// };

// const authMiddlewareSocket = async (socket) => {};

// //1.accessToken => verify해서 try/catch로 감싸서 에러처리  refreshToken
// function accessTokenVerify(jwt, accessToken) {
//   try {
//     //토큰에 뭐 집어넣을지 물어보기
//     const { id } = jwt.verify(accessToken, tokenKey);
//     return id;
//   } catch (err) {}
// }
// function verifyToken(accessToken, refreshToken, tokenKey) {}
// module.exports = { authMiddlewareHttp, authMiddlewareSocket };
