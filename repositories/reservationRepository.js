const { Reservations, Users } = require('../models');

class ReservationRepository {
  viewreservation = async (userId) => {
    const reservationDatas = await Reservations.findAll({
      where: { userId },
      attribute: [
        'id',
        'userId',
        'petSitterId',
        'startDate',
        'endDate',
        'totalPrice',
      ],
      include: [
        {
          model: Users,
          attribute: ['name'],
        },
      ],
    });
    return reservationDatas;
  };

  createreservation = async (
    userId,
    startDate,
    endDate,
    petType,
    petSitterId,
    totalPrice,
  ) => {
    const reservation = await Reservations.create({
      userId,
      petSitterId,
      petType,
      startDate,
      endDate,
      totalPrice,
    });
    return reservation;
  };

  viewonereservation = async (reservationId) => {
    const reservationData = await Reservations.findOne({
      where: { id: reservationId },
      attribute: [
        'id',
        'userId',
        'petSitterId',
        'startDate',
        'endDate',
        'totalPrice',
      ],
      include: [
        {
          model: Users,
          attribute: ['name'],
        },
      ],
    });
    return reservationData;
  };

  updateReservation = async (
    reservationId,
    startDate,
    endDate,
    petType,
    petSitterId,
    totalPrice,
  ) => {
    const updateReservation = await Reservations.update(
      { where: { id: reservationId } },
      {
        startDate,
        endDate,
        petType,
        petSitterId,
        totalPrice,
      },
    );
    return updateReservation;
  };

  deletereservation = async (reservationId) => {
    const deleteReservation = await Reservations.destroy({
      where: { id: reservationId },
    });
    return deleteReservation;
  };
}

module.exports = ReservationRepository;