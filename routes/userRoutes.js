const express = require('express');
const router = express.Router();
const { authMiddlewareHttp } = require('../middlewares/auth-middleware');

const UserController = require('../controller/userController.js');
const userController = new UserController();

router.post('/signup', userController.createUser);
router.post('/login', userController.login);
router.get('/getuser', authMiddlewareHttp, userController.showUserInfo);
// router.put('/password', userController.modifyUserPass);
// router.put('/', userController.modifyUserInfo);

module.exports = router;
