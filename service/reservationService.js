const ReservationRepository = require('../repositories/reservationRepository');

class ReservationService {
  reservationRepository = new ReservationRepository();

  viewreservation = async (userId) => {
    const reservationDatas = await this.reservationRepository.viewreservation(
      userId,
    );

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
    const reservation = await this.reservationRepository.createreservation(
      userId,
      startDate,
      endDate,
      petType,
      petSitterId,
      totalPrice,
    );
    return reservation;
  };

  viewonereservation = async (reservationId) => {
    const reservationData = await this.reservationRepository.viewonereservation(
      reservationId,
    );
    return reservationData;
  };

  updatereservation = async (
    reservationId,
    startDate,
    endDate,
    petType,
    petSitterId,
    totalPrice,
  ) => {
    const updateReservation =
      await this.reservationRepository.updatereservation(
        reservationId,
        startDate,
        endDate,
        petType,
        petSitterId,
        totalPrice,
      );
    return updateReservation;
  };

  deletereservation = async (reservationId) => {
    const deleteReservation =
      await this.reservationRepository.deletereservation(reservationId);
    return deleteReservation;
  };
}

module.exports = ReservationService;
