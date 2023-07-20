const MakeError = require('../utils/makeErrorUtil');
const ReviewRepository = require('../repositories/reviewRepository');
const { Op } = require('sequelize');

class ReviewService {
  reviewRepository = new ReviewRepository();

  createReview = async ({
    reservationId,
    userId,
    petSitterId,
    rating,
    comment,
    image,
    endDate,
  }) => {
    const now = new Date();
    try {
      if (!comment) {
        throw new MakeError('내용을 입력해주세요', 400, 'invalid comment');
      }
      if (endDate < now) {
        throw new MakeError('종료되지 않은 예약입니다', 400, 'invalid date');
      }
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
        petSitterId: createReviewData.petSitterId,
        rating: createReviewData.rating,
        comment: createReviewData.comment,
        image: createReviewData.image,
      };
    } catch (err) {
      throw err;
    }
  };

  findAllReview = async () => {
    const allReview = await this.reviewRepository.findAllReview();
    console.log(allReview);
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
      const deleteCount = await reviewRepository.deleteReview(deleteOptions);
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
