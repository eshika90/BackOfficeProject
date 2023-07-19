const jwt = require('jsonwebtoken');
const UserService = require('../service/userService');
const userService = new UserService();
const cookieParser = require('cookie-parser');
const jwtInfo = require('../config.js').jwt;
const { secretKey, expiresIn } = jwtInfo;
const MakeError = require('../utils/makeErrorUtil');

const authMiddlewareHttp = async (req, res, next) => {
  try {
    const [accessTokenAuthType, accessToken] = (
      req.cookies.accessToken ?? ''
    ).split(' ');
    const [refreshTokenAuthType, refreshToken] = (
      req.cookies.refreshToken ?? ''
    ).split(' ');

    if (
      accessTokenAuthType !== 'Bearer' ||
      !refreshToken ||
      refreshTokenAuthType !== 'Bearer' ||
      !accessToken
    ) {
      throw new MakeError(401, '로그인이 필요한 기능입니다', 'invalid token');
    }

    const tokenAndUserId = await verifyToken(
      jwt,
      accessToken,
      refreshToken,
      secretKey,
    );

    if (tokenAndUserId.newAccessToken) {
      res.cookie('accessToken', `Bearer ${tokenAndUserId.newAccessToken}`);
    }

    res.locals.payload = { userId: tokenAndUserId.userId };
    next();
  } catch (err) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(401).json('로그인이 필요한 기능1입니다');
  }
};

const authMiddlewareSocket = async (socket) => {};

//1.accessToken => verify해서 try/catch로 감싸서 에러처리  refreshToken
function accessTokenVerify(jwt, accessToken) {
  try {
    //토큰에 뭐 집어넣을지 물어보기
    const payload = jwt.verify(accessToken, secretKey);
    return payload;
  } catch (err) {
    return { userId: null };
  }
}
const verifyToken = async (jwt, accessToken, refreshToken, secretKey) => {
  try {
    const payload = accessTokenVerify(jwt, accessToken);

    if (payload.userId) {
      payload.newAccessToken = null;
      return payload;
    } else {
      jwt.verify(refreshToken, secretKey);
    }

    const user = await userService.getUser({ refreshToken }, ['id']);
    if (user) {
      const newAccessToken = jwt.sign({ userId: user.id }, secretKey, {
        expiresIn,
      });
      return { userId: user.userId, newAccessToken };
    }
  } catch (err) {
    throw new MakeError(401, '로그인이 필요한 기능입니다', 'invalid token');
  }
};
module.exports = { authMiddlewareHttp, authMiddlewareSocket };
