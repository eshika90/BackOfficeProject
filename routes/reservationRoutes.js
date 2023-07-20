const express = require('express');
const router = express.Router();

const { authMiddlewareHttp } = require('../middlewares/auth-middleware');

const ReservationController = require('../controller/reservationController');
const reservationController = new ReservationController();

router.post(
  '/reservation',
  authMiddlewareHttp,
  reservationController.createreservation,
);
router.get(
  '/reservation',
  authMiddlewareHttp,
  reservationController.viewreservation,
);
router.get(
  '/reservation/:reservationId',
  authMiddlewareHttp,
  reservationController.viewonereservation,
);
router.put(
  '/reservation/:reservationId',
  authMiddlewareHttp,
  reservationController.updatereservation,
);
router.delete(
  '/reservation/:reservationId',
  authMiddlewareHttp,
  reservationController.deletereservation,
);

module.exports = router;