const { Reservations, Users, PetSitterInfos } = require('../models');
const { Op } = require('sequelize');

class ReservationRepository {
  // 전체 조회
  viewReservation = async (userId) => {
    const reservationDatas = await Reservations.findAll({
      where: { userId },
      attributes: [
        'id',
        'userId',
        'petSitterId',
        'startDate',
        'endDate',
        'totalPrice',
        'petType',
        'updatedAt',
      ],
      include: [
        {
          model: Users,
          attributes: ['name'],
        },
      ],
    });

    return reservationDatas;
  };

  // 예약 날짜 중복 여부 확인
  dateReservation = async (
    reservationId,
    petSitterId,
    startDates,
    endDates,
  ) => {
    // const id = Number(reservationId);
    const reservationDatas = await Reservations.findAll({
      where: {
        [Op.and]: [
          { id: { [Op.notIn]: [reservationId] } },
          { petSitterId },
          {
            [Op.or]: [
              // 작거나 같음
              { startDate: { [Op.lte]: endDates } },
            ],
          },
          {
            [Op.or]: [
              // 크거나 같음
              { endDate: { [Op.gte]: startDates } },
            ],
          },
        ],
      },
      attributes: ['startDate', 'endDate'],
    });
    console.log(reservationDatas);
    return reservationDatas;
  };

  //예약 날짜, 유저 중복 확인
  dateReservation = async (petSitterId, startDates, endDates) => {
    const reservationDatas = await Reservations.findAll({
      where: {
        [Op.and]: [
          { petSitterId },
          {
            [Op.or]: [
              // 작거나 같음
              { startDate: { [Op.lte]: endDates } },
            ],
          },
          {
            [Op.or]: [
              // 크거나 같음
              { endDate: { [Op.gte]: startDates } },
            ],
          },
        ],
      },
      attributes: ['startDate', 'endDate'],
    });
    console.log(reservationDatas);
    return reservationDatas;
  };

  // 펫시터 정보 확인
  findsReservation = async (petSitterId) => {
    const reservationData = await PetSitterInfos.findOne({
      where: { id: petSitterId },
    });

    return reservationData;
  };

  // 예약 등록
  createReservation = async (
    userId,
    startDate,
    endDate,
    petType,
    petSitterId,
    totalPrices,
  ) => {
    const reservation = await Reservations.create({
      userId,
      startDate,
      endDate,
      petType,
      petSitterId,
      totalPrice: totalPrices,
    });

    return reservation;
  };

  // 예약 상세 조회
  viewOneReservation = async (reservationId) => {
    const reservationData = await Reservations.findOne({
      where: { id: reservationId },
      attributes: [
        'id',
        'userId',
        'petSitterId',
        'startDate',
        'endDate',
        'totalPrice',
        'petType',
        'updatedAt',
      ],
      include: [
        {
          model: Users,
          attributes: ['name'],
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
    return updatereservation;
  };

  // 예약 취소
  deleteReservation = async (reservationId) => {
    const deleteReservation = await Reservations.destroy({
      where: { id: reservationId },
    });
    return deleteReservation;
  };

  a = async (petSitterId) => {
    const e = await Reservations.findAll({
      where: { petSitterId },
    });
    return e;
  };
}

module.exports = ReservationRepository;
