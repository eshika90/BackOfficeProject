const express = require('express');
const router = express.Router();

const usersRouter = require('./userRoutes.js');
const reservationRouter = require('./reservationRoutes.js');
const reviewRouter = require('./reviewRoutes.js');
const petSitterInfoRouter = require('./petSitterInfoRoutes.js');

router.use('/users', usersRouter);
router.use('/', reservationRouter);
router.use('/', reviewRouter);
router.use('/', petSitterInfoRouter);

module.exports = router;
