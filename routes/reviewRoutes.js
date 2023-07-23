const express = require('express');
const router = express.Router();
const { authMiddlewareHttp } = require('../middlewares/auth-middleware');

const ReviewsController = require('../controller/reviewController');
const reviewsController = new ReviewsController();

// 전체 리뷰 가져오기
router.get('/reviews', reviewsController.findAllReview);
// 특정 펫시터 리뷰 가져오기
router.get(
  '/petSitterInfo/:petSitterId/reviews',
  reviewsController.findPetSitterReview,
);
// 특정 예약 리뷰 가져오기
router.get(
  '/reservation/:reservationId/review',
  reviewsController.findReservationReview,
);
// 리뷰 작성
router.post(
  '/reservation/:reservationId/reviews',
  authMiddlewareHttp,
  reviewsController.createReview,
);
// 리뷰 삭제
router.delete(
  '/reviews/:id',
  authMiddlewareHttp,
  reviewsController.deleteReview,
);

module.exports = router;
