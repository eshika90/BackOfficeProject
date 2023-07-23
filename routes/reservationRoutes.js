const express = require('express');
const router = express.Router();

const { authMiddlewareHttp } = require('../middlewares/auth-middleware');

const ReservationController = require('../controller/reservationController');
const reservationController = new ReservationController();

// 전체 조회
router.get(
  '/reservation',
  authMiddlewareHttp,
  reservationController.viewReservation,
);

// 예약 등록
router.post(
  '/reservation',
  authMiddlewareHttp,
  reservationController.createReservation,
);

// 예약 상세 조회
router.get(
  '/reservation/:reservationId',
  authMiddlewareHttp,
  reservationController.viewOneReservation,
);

// 예약 수정
router.put(
  '/reservation/:reservationId',
  authMiddlewareHttp,
  reservationController.updateReservation,
);

// 예약 취소
router.delete(
  '/reservation/:reservationId',
  authMiddlewareHttp,
  reservationController.deleteReservation,
);

module.exports = router;
