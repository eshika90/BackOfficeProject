const ReviewService = require('../service/reviewService');

class ReviewController {
  constructor() {
    this.reviewService = new ReviewService();
  }

  createReview = async (req, res) => {
    let { rating, comment, image } = req.body;
    const { reservationId } = req.params;
    const userId = res.locals.payload.userId;

    try {
      if (!reservationId || !userId || !rating || !comment) {
        res.status(400).json({
          message: '필수 데이터가 입력되지 않았습니다',
        });
      }
      if (isNaN(reservationId.trim())) {
        res.status(400).json({
          message: '리뷰 작성 실패',
        });
      }
      await this.reviewService.createReview({
        reservationId,
        userId,
        rating,
        comment,
        image,
      });
      return res.status(201).json({ message: '리뷰 작성 완료' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server Error' });
    }
  };

  findAllReview = async (req, res) => {
    try {
      const reviews = await this.reviewService.findAllReview();
      return res.status(200).json({ reviews: reviews });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server Error' });
    }
  };

  findReservationReview = async (req, res) => {
    const { reservationId } = req.params;

    try {
      if (!reservationId) {
        return res.status(400).json({
          meesage: '예약 상세페이지 리뷰 불러오기 실패',
        });
      }
      if (isNaN(reservationId.trim())) {
        res.status(400).json({
          message: '예약 상세페이지 리뷰 불러오기 실패',
        });
      }
      const reviews = await this.reviewService.findReservationReview(
        reservationId,
      );
      return res.status(200).json({ reviews: reviews });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server Error' });
    }
  };

  findPetSitterReview = async (req, res) => {
    const { petSitterId } = req.params;

    try {
      if (!petSitterId) {
        return res.status(400).json({
          meesage: '펫시터 리뷰 불러오기 실패',
        });
      }
      if (isNaN(petSitterId.trim())) {
        res.status(400).json({
          message: '펫시터 리뷰 불러오기 실패',
        });
      }
      const reviews = await this.reviewService.findPetSitterReview(petSitterId);
      console.log('reviews', reviews);
      return res.status(200).json({ reviews: reviews });
    } catch (err) {
      try {
        return res.status(500).json({ message: 'Server Error' });
      } catch (errors) {
        console.log(errors);
      }
    }
  };

  deleteReview = async (req, res) => {
    const userId = res.locals.payload.userId;
    const { id } = req.params;
    try {
      if (!id || !userId) {
        return res.status(400).json({ message: '리뷰 삭제 실패' });
      }
      if (isNaN(id.trim())) {
        res.status(400).json({
          message: '리뷰 삭제 실패',
        });
      }
      await this.reviewService.deleteReview({ userId, id });
      return res.status(200).json({ message: '리뷰 삭제 완료' });
    } catch (err) {
      if (err.code === 401) {
        return res.status(401).json({ message: err.message });
      } else {
        return res.status(500).json({ message: 'Server Error' });
      }
    }
  };
}

module.exports = ReviewController;
