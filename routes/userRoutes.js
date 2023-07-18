const express = require('express');
const router = express.Router();

const UserController = require('../controller/userController.js');
const userController = new UserController();

router.post('/signup', userController.createUser);

module.exports = router;
