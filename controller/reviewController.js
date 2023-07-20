const ReviewService = require('../service/reviewService');
// const ReservationController = require('../controller/reservationController');

class ReviewController {
  constructor() {
    this.reviewService = new ReviewService();
    // this.reservationController = new ReservationController();
  }

  createReview = async (req, res) => {
    console.log('111111');
    const { userId, rating, comment, image } = req.body;
    const { reservationId } = req.params;
    // const userId = res.locals.user.id;
    // reservation 컨트롤러에서 가져오기
    // params의 "예약id"에 해당하는 예약의 "펫시터id"와 "예약종료일"이  필요
    // const reservationDatas = this.reservationController.viewreservation();
    // const { petSitterId } = reservationDatas.petSitterId;
    const petSitterId = 1;
    console.log('2222222222');
    const endDate = '2023-07-20';

    try {
      if (
        !reservationId ||
        !userId ||
        !rating ||
        !comment ||
        !petSitterId ||
        !endDate
      ) {
        res.status(400).json({
          message: '리뷰 작성 실패',
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
        petSitterId,
        rating,
        comment,
        image,
        endDate,
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
      return res.status(200).json({ reviews: reviews });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Server Error' });
    }
  };

  deleteReview = async (req, res) => {
    const userId = res.locals.user.id;
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
