const express = require('express');
const router = express.Router();
const { authMiddlewareHttp } = require('../middlewares/auth-middleware');

const UserController = require('../controller/userController.js');
const userController = new UserController();

router.post('/verifyemail', userController.mailVerify);
router.post('/verifyemailcode', userController.mailCodeVerify);
router.post('/signup', userController.createUser);
router.post('/login', userController.login);
router.get('/getuser', authMiddlewareHttp, userController.showUserInfo);
router.put('/password', authMiddlewareHttp, userController.modifyUserPass);
router.put('/', authMiddlewareHttp, userController.modifyUserInfo);

module.exports = router;
