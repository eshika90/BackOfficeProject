const { json } = require('sequelize');
const ReservationService = require('../service/reservationService');

class ReservationController {
  reservationService = new ReservationService();

  // 전체 조회
  viewReservation = async (req, res) => {
    const { userId } = res.locals.payload;

    const result = await this.reservationService.viewReservation(userId);
    return res.status(result.status).json({ message: result.message });
  };

  // 예약 등록
  createReservation = async (req, res) => {
    const { userId } = res.locals.payload;

    const { startDate, endDate, petType, petSitterId, totalPrice } = req.body;

    const result = await this.reservationService.createReservation(
      userId,
      startDate,
      endDate,
      petType,
      petSitterId,
      totalPrice,
    );
    return res.status(result.status).json({ message: result.message });
  };

  // 예약 상세 조회
  viewOneReservation = async (req, res) => {
    const { reservationId } = req.params;
    const result = await this.reservationService.viewOneReservation(
      reservationId,
    );
    return res.status(result.status).json({ message: result.message });
  };

  // 예약 수정
  updateReservation = async (req, res) => {
    const { userId } = res.locals.payload;
    const { reservationId } = req.params;
    const { startDate, endDate, petType, petSitterId, totalPrice } = req.body;

    const result = await this.reservationService.updateReservation(
      userId,
      reservationId,
      startDate,
      endDate,
      petType,
      petSitterId,
      totalPrice,
    );
    return res.status(result.status).json({ message: result.message });
  };

  // 예약 취소
  deleteReservation = async (req, res) => {
    const { userId } = res.locals.payload;
    const { reservationId } = req.params;

    const result = await this.reservationService.deleteReservation(
      userId,
      reservationId,
    );
    return res.status(result.status).json({ message: result.message });
  };
}

module.exports = ReservationController;
