const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware');

const ReservationController = require('../controller/reservationController');
const reservationController = new ReservationController();

router.post(
  '/reservation',
  authMiddleware,
  reservationController.createreservation,
);
router.get(
  'reservation',
  authMiddleware,
  reservationController.viewreservation,
);
router.get(
  'reservation/:reservationId',
  authMiddleware,
  reservationController.viewonereservation,
);
router.put(
  'reservation/:reservationId',
  authMiddleware,
  reservationController.updatereservation,
);
router.delete(
  'reservation/:reservationId',
  authMiddleware,
  reservationController.deletereservation,
);
