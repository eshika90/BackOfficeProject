const { Reservations, Users } = require('../models');

class ReservationRepository {
  // 전체 조회
  viewReservation = async (userId) => {
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

  // 예약 등록
  createReservation = async (
    userId,
    startDate,
    endDate,
    petType,
    petSitterId,
    totalPrice,
  ) => {
    const reservation = await Reservations.create({
      userId,
      startDate,
      endDate,
      petType,
      petSitterId,
      totalPrice,
    });

    return reservation;
  };

  // 예약 상세 조회
  viewOneReservation = async (reservationId) => {
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

  // 예약 수정
  updateReservation = async (
    reservationId,
    startDate,
    endDate,
    petType,
    petSitterId,
    totalPrice,
  ) => {
    const updatereservation = await Reservations.update(
      {
        startDate,
        endDate,
        petType,
        petSitterId,
        totalPrice,
      },
      { where: { id: reservationId } },
    );
    console.log(updatereservation);
    return updatereservation;
  };

  // 예약 취소
  deleteReservation = async (reservationId) => {
    const deleteReservation = await Reservations.destroy({
      where: { id: reservationId },
    });
    return deleteReservation;
  };
}

module.exports = ReservationRepository;
