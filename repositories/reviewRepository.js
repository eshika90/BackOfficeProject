const { Reviews } = require('../models');

class ReviewRepository {
  createReview = async ({
    reservationId,
    petSitterId,
    userId,
    rating,
    comment,
    image,
  }) => {
    try {
      const isReview = await Reviews.findOne({
        where: { reservationId, userId },
      });

      if (isReview) {
        const createReviewData = await Reviews.create({
          reservationId,
          userId,
          petSitterId,
          rating,
          comment,
          image,
        });
        return createReviewData;
      }
    } catch (err) {
      console.log(err);
      return { errorMessage: 'review repository fail' };
    }
  };
  findAllReview = async () => {
    console.log('111');
    const reviews = await Reviews.findAll();
    console.log(reviews);
    return reviews;
  };
  findPetSitterReview = async (petSitterId) => {
    const review = await Reviews.findAll({ where: { petSitterId } });
    return review;
  };
  deleteReview = async (reviewData) => {
    const deleteReview = await Reviews.destroy(reviewData);
    return deleteReview;
  };
}

module.exports = ReviewRepository;
