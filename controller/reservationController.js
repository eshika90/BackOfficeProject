const { json } = require('sequelize');
const ReservationService = require('../service/reservationService');

class ReservationController {
  reservationService = new ReservationService();

  viewreservation = async (req, res) => {
    const { userId } = res.locals.payload;

    const reservationDatas = await this.reservationService.viewreservation(
      userId,
    );

    try {
      if (!reservationDatas) {
        return res(200).json({
          message: '예약된 정보가 없습니다.',
        });
      } else if (reservationDatas) {
        return (
          res(200),
          json({
            reservationDatas,
          })
        );
      }
    } catch {
      return res(500).json({ message: 'Server Error' });
    }
  };

  createreservation = async (req, res) => {
    const { userId } = res.locals.payload;

    const { startDate, endDate, petType, petSitterId, totalPrice } = req.body;

    try {
      if (!petSitterId) {
        return res.status(400).json({ message: '펫시터를 정해주세요.' });
      } else if (!startDate) {
        return res
          .status(400)
          .json({ message: '예약 시작 날짜를 정해주세요.' });
      } else if (!endDate) {
        return res
          .status(400)
          .json({ message: '예약 마지막 날짜를 정해주세요.' });
      } else if (!petType) {
        return res
          .status(400)
          .json({ message: '어떤 반려동물인지 정해주세요.' });
      }
      const reservation = await this.reservationService.createreservation(
        userId,
        startDate,
        endDate,
        petType,
        petSitterId,
        totalPrice,
      );
      if (reservation) {
        return res.status(200).json({ message: '예약 성공' });
      } else if (!reservation) {
        return res.status(400).json({ message: '예약 실패' });
      }
    } catch {
      return res(500).json({ message: 'Server Error' });
    }
  };

  viewonereservation = async (req, res) => {
    const { reservationId } = req.params;
    try {
      if (!reservationId) {
        return res
          .status(400)
          .json({ message: '해당 예약 정보를 불러오는데 실패하였습니다.' });
      }
      const reservationData = await this.reservationService.viewonereservation(
        reservationId,
      );
      if (reservationData) {
        return (
          res(200),
          json({
            reservationData,
          })
        );
      }
    } catch {
      return res(500).json({ message: 'Server Error' });
    }
  };

  updatereservation = async (req, res) => {
    const { userId } = res.locals.payload;
    const { reservationId } = req.params;
    const { startDate, endDate, petType, petSitterId, totalPrice } = res.body;
    const reservationData = await this.reservationService.viewonereservation(
      reservationId,
    );

    try {
      if (!reservationId) {
        return res
          .status(400)
          .json({ message: '존재하지 않는 예약 정보입니다.' });
      } else if (userId !== reservationData.userId) {
        return res.status(400).json({ message: '수정 권한이 없습니다.' });
      } else if (!startDate) {
        return res
          .status(400)
          .json({ message: '예약 시작 날짜를 정해주세요.' });
      } else if (!endDate) {
        return res
          .status(400)
          .json({ message: '예약 마지막 날짜를 정해주세요.' });
      } else if (!petType) {
        return res
          .status(400)
          .json({ message: '어떤 반려동물인지 정해주세요.' });
      }
      const updateReservation = await this.reservationService.updatereservation(
        reservationId,
        startDate,
        endDate,
        petType,
        petSitterId,
        totalPrice,
      );
      if (updateReservation) {
        return res.status(200).json({ message: '예약 성공' });
      } else if (!updateReservation) {
        return res.status(400).json({ message: '예약 실패' });
      }
    } catch {
      return res(500).json({ message: 'Server Error' });
    }
  };

  deletereservation = async (req, res) => {
    const { userId } = res.locals.payload;
    const { reservationId } = req.params;
    const reservationData = await this.reservationService.viewonereservation(
      reservationId,
    );
    try {
      if (!reservationId) {
        return res
          .status(400)
          .json({ message: '존재하지 않는 예약 정보입니다.' });
      } else if (userId !== reservationData.userId) {
        return res.status(400).json({ message: '삭제 권한이 없습니다.' });
      }
      const deleteReservation = await this.reservationService.deletereservation(
        reservationId,
      );
      if (deleteReservation) {
        return res.status(200).json({ message: '삭제 성공' });
      } else if (!deleteReservation) {
        return res.status(400).json({ message: '삭제 실패' });
      }
    } catch {
      return res(500).json({ message: 'Server Error' });
    }
  };
}

module.exports = ReservationController;