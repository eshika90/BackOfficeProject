const MakeError = require('../utils/makeErrorUtil');
const ReviewRepository = require('../repositories/reviewRepository');
const ReservationService = require('../service/reservationService');
const { Op } = require('sequelize');

class ReviewService {
  constructor() {
    this.reservationService = new ReservationService();
  }
  reviewRepository = new ReviewRepository();

  createReview = async ({ reservationId, userId, rating, comment, image }) => {
    const now = new Date();
    const loginUserId = userId;
    try {
      // 예약 서비스에 있는 예약 데이터 가져오기
      const reservationReturnValue =
        await this.reservationService.viewOneReservation(reservationId);
      const reservationData = reservationReturnValue.message;
      // reservationId에 해당하는 petSitterId 가져오기
      const petSitterId = reservationData.petSitterId;
      if (!comment) {
        throw new MakeError('내용을 입력해주세요', 400, 'invalid comment');
      }
      if (reservationData.endDate > now) {
        throw new MakeError('종료되지 않은 예약입니다', 400, 'invalid date');
      }
      // 예약 userId와 로그인한 유저의 id가 일치할때
      if (reservationData.userId == loginUserId) {
        const createReviewData = await this.reviewRepository.createReview({
          reservationId,
          userId,
          petSitterId,
          rating,
          comment,
          image,
        });
        return {
          userId: createReviewData.userId,
          reservationId: createReviewData.reservationId,
          petSitterId: petSitterId,
          rating: createReviewData.rating,
          comment: createReviewData.comment,
          image: createReviewData.image,
        };
      }
    } catch (err) {
      throw err;
    }
  };

  findAllReview = async () => {
    const allReview = await this.reviewRepository.findAllReview();
    allReview.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return allReview.map((review) => {
      return {
        id: review.id,
        reservationId: review.reservationId,
        userId: review.userId,
        petSitterId: review.petSitterId,
        rating: review.rating,
        comment: review.comment,
        image: review.image,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      };
    });
  };

  findPetSitterReview = async (petSitterId) => {
    const allReview = await this.reviewRepository.findPetSitterReview(
      petSitterId,
    );

    allReview.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return allReview.map((review) => {
      return {
        id: review.id,
        reservationId: review.reservationId,
        userId: review.userId,
        petSitterId: review.petSitterId,
        rating: review.rating,
        comment: review.comment,
        image: review.image,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      };
    });
  };

  deleteReview = async (reviewData) => {
    const { id, userId } = reviewData;
    const deleteOptions = {
      where: {
        [Op.and]: [{ id, userId }],
      },
    };

    try {
      if (isNaN(id / 1)) {
        throw new MakeError(
          '유효하지 않은 리뷰id입니다',
          401,
          'invalid reviewId',
        );
      } else if (!userId || isNaN(userId / 1)) {
        throw new MakeError(
          '유효하지 않은 userId입니다',
          401,
          'invalid userId',
        );
      }
      const deleteCount = await this.reviewRepository.deleteReview(
        deleteOptions,
      );
      if (!deleteCount) {
        throw new MakeError(
          '리뷰 삭제에 실패하였습니다',
          400,
          '리뷰 삭제 실패',
        );
      }
      return;
    } catch (err) {
      throw err;
    }
  };
}

module.exports = ReviewService;
