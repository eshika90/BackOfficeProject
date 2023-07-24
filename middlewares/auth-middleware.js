const jwt = require('jsonwebtoken');
const UserService = require('../service/userService');
const userService = new UserService();
const jwtInfo = require('../config.js').jwt;
const { secretKey, expireIn } = jwtInfo;
const MakeError = require('../utils/makeErrorUtil');
const cookieParser = require('../utils/cookie.parsing');

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
      expireIn,
    );
    if (tokenAndUserId.newAccessToken) {
      res.cookie('accessToken', `Bearer ${tokenAndUserId.newAccessToken}`, {
        httpOnly: true,
      });
    }
    res.locals.payload = { userId: tokenAndUserId.userId };
    next();
  } catch (err) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(401).json('로그인이 필요한 기능입니다');
  }
};

const authMiddlewareSocket = async (socket) => {
  try {
    let cookieValues = socket.handshake.headers.cookie;
    let parsedCookies = cookieParser(cookieValues);

    const [accessTokenAuthType, accessToken] = (
      parsedCookies.accessToken ?? ''
    ).split(' ');
    const [refreshTokenAuthType, refreshToken] = (
      parsedCookies.refreshToken ?? ''
    ).split(' ');
    if (
      accessTokenAuthType !== 'Bearer' ||
      !refreshToken ||
      refreshTokenAuthType !== 'Bearer' ||
      !accessToken
    ) {
      throw new MakeError(401, '로그인이 필요한 기능입니다', 'invalid token');
    }

    if (!accessToken || !refreshToken) throw new Error();

    const userAndToken = await verifyToken(
      jwt,
      accessToken,
      refreshToken,
      secretKey,
      expireIn,
    );

    socket.userId = userAndToken.userId;
  } catch (err) {
    console.log(err);
    socket.userId = NaN;
  }
};

function accessTokenVerify(jwt, accessToken) {
  try {
    const payload = jwt.verify(accessToken, secretKey);
    return payload;
  } catch (err) {
    return { userId: null };
  }
}

const verifyToken = async (
  jwt,
  accessToken,
  refreshToken,
  secretKey,
  expiresIn,
) => {
  try {
    const payload = accessTokenVerify(jwt, accessToken);
    if (payload.userId) {
      payload.newAccessToken = null;
      return payload;
    } else {
      jwt.verify(refreshToken, secretKey);
      const user = await userService.getUser({ refreshToken }, ['id']);
      if (user) {
        const newAccessToken = jwt.sign({ userId: user.id }, secretKey, {
          expiresIn,
        });
        return { userId: user.id, newAccessToken };
      }
    }
  } catch (err) {
    throw new MakeError(401, '로그인이 필요한 기능입니다', 'invalid token');
  }
};
module.exports = { authMiddlewareHttp, authMiddlewareSocket };
