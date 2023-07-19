const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

const ReviewsController = require('../controller/reviewController');
const reviewsController = new ReviewsController();

// 전체 리뷰 가져오기
router.get('/api/reviews', reviewsController.findAllReview);
// 특정 펫시터 리뷰 가져오기
router.get(
  '/api/petSitterInfo/:petSitterId/reviews',
  reviewsController.findPetSitterReview,
);
// 리뷰 작성
router.post(
  '/api/reservation/:reservationId/:petSitterId/reviews',
  // authMiddleware,
  reviewsController.createReview,
);
// 리뷰 삭제
router.delete(
  '/api/reviews/:id',
  // authMiddleware,
  reviewsController.deleteReview,
);

module.exports = router;
