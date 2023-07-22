const { Reviews, Users } = require('../models');
const { Op } = require('sequelize');

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
        where: {
          [Op.and]: [{ reservationId }, { userId }],
        },
      });

      if (!isReview) {
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
      return { errorMessage: '이미 해당 reservationId가 존재합니다' };
    }
  };
  findAllReview = async () => {
    const reviews = await Reviews.findAll({
      include: [
        {
          model: Users,
          attributes: ['name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return reviews;
  };
  findPetSitterReview = async (petSitterId) => {
    const reviews = await Reviews.findAll({
      where: { petSitterId },
    });
    return reviews;
  };
  deleteReview = async (deleteOptions) => {
    const deleteReview = await Reviews.destroy(deleteOptions);
    return deleteReview;
  };
}

module.exports = ReviewRepository;
