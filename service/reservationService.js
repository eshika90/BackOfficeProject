const ReservationRepository = require('../repositories/reservationRepository');
const reservationDateCalculation = require('../utils/reservationDateCalculationUtil');

class ReservationService {
  reservationRepository = new ReservationRepository();

  // 전체 조회
  viewReservation = async (userId) => {
    const reservationDatas = await this.reservationRepository.viewReservation(
      userId,
    );

    try {
      if (!reservationDatas.length) {
        return { status: 200, message: '예약된 정보가 없습니다.' };
      } else if (reservationDatas) {
        return { status: 200, message: reservationDatas };
      }
    } catch (err) {
      return { status: 500, message: 'Server Error' };
    }
  };

  // 예약 등록
  createReservation = async (
    userId,
    startDate,
    endDate,
    petType,
    petSitterId,
  ) => {
    try {
      const today = new Date();
      const startDates = new Date(startDate);
      const endDates = new Date(endDate);
      const canStartReservationDate = new Date(today.setDate(today.getDate()));

      const canEndReservationDate = new Date(
        today.setDate(today.getDate() + 91),
      );

      if (startDates < canStartReservationDate) {
        return {
          status: 400,
          message: '시작 날짜는 내일부터 가능합니다.',
        };
      } else if (endDates > canEndReservationDate) {
        return {
          status: 400,
          message: '마지막 날짜는 90일이전까지 가능합니다.',
        };
      } else if (!petSitterId) {
        return { status: 400, message: '펫시터가 올바르지 않습니다.' };
      } else if (!startDate) {
        return { status: 400, message: '예약 시작 날짜를 정해주세요.' };
      } else if (!endDate) {
        return { status: 400, message: '예약 마지막 날짜를 정해주세요.' };
      } else if (!petType) {
        return { status: 400, message: '어떤 반려동물인지 정해주세요.' };
      }
      // 존재하는 예약 날짜인지 확인
      const reservationDatas =
        await this.reservationRepository.createdateReservation(
          petSitterId,
          startDate,
          endDate,
        );

      // 펫시터 가격 확인
      const reservationData = await this.reservationRepository.findsReservation(
        petSitterId,
      );
      // 총 가격 계산
      const totalPrices = reservationDateCalculation(
        reservationData,
        startDate,
        endDate,
      );
      if (userId == reservationData.userId) {
        return { status: 400, message: '펫시터랑 로그인 유저랑 같음' };
      }
      if (reservationDatas.length) {
        return {
          status: 400,
          message: '예약 현황을 확인해 주세요.',
        };
      } else if (totalPrices <= 0) {
        return { status: 400, message: '예약 날짜를 확인해주세요' };
      }

      const reservation = await this.reservationRepository.createReservation(
        userId,
        startDate,
        endDate,
        petType,
        petSitterId,
        totalPrices,
      );
      if (reservation) {
        return { status: 200, message: '예약 성공' };
      } else if (!reservation) {
        return { status: 400, message: '예약 실패' };
      }
    } catch (err) {
      console.log(err);
      return { status: 500, message: 'Server Error' };
    }
  };
  //a
  // 예약 상세 조회
  viewOneReservation = async (reservationId) => {
    const reservationData = await this.reservationRepository.viewOneReservation(
      reservationId,
    );
    try {
      if (!reservationData) {
        return {
          status: 400,
          message: `해당 예약 정보를 불러오는데 실패하였습니다.`,
        };
      } else if (reservationData) {
        return {
          status: 200,
          message: reservationData,
        };
      }
    } catch {
      return {
        status: 500,
        message: 'Server Error',
      };
    }
  };

  // 예약 수정
  updateReservation = async (
    userId,
    reservationId,
    startDate,
    endDate,
    petType,
    petSitterId,
  ) => {
    try {
      const today = new Date();
      const startDates = new Date(startDate);
      const endDates = new Date(endDate);
      const canStartReservationDate = new Date(
        today.setDate(today.getDate() + 1),
      );
      const canEndReservationDate = new Date(
        today.setDate(today.getDate() + 91),
      );

      if (startDates < canStartReservationDate) {
        return {
          status: 400,
          message: '시작 날짜는 내일부터 가능합니다.',
        };
      } else if (endDates > canEndReservationDate) {
        return {
          status: 400,
          message: '마지막 날짜는 90일이전까지 가능합니다.',
        };
      } else if (!startDate) {
        return { status: 400, message: '예약 시작 날짜를 정해주세요.' };
      } else if (!endDate) {
        return { status: 400, message: '예약 마지막 날짜를 정해주세요.' };
      } else if (!petType) {
        return { status: 400, message: '어떤 반려동물인지 정해주세요.' };
      }
      // 존재하는 예약 정보인지 확인
      const reservation = await this.reservationRepository.viewOneReservation(
        reservationId,
      );

      // 존재하는 예약 날짜인지 확인
      const reservationDatas =
        await this.reservationRepository.updatedateReservation(
          reservationId,
          petSitterId,
          startDate,
          endDate,
        );

      // 펫시터 가격 확인
      const reservationData = await this.reservationRepository.findsReservation(
        petSitterId,
      );
      // 총 가격 계산
      const totalPrices = reservationDateCalculation(
        reservationData,
        startDate,
        endDate,
      );
      if (!reservation) {
        return { status: 400, message: '존재하지 않는 예약 정보입니다.' };
      } else if (reservationDatas.length) {
        return {
          status: 400,
          message: '예약 현황을 확인해 주세요',
        };
      } else if (userId != reservation.userId) {
        return { status: 400, message: '수정 권한이 없습니다.' };
      } else if (totalPrices <= 0) {
        return { status: 400, message: '예약 날짜를 확인해주세요.' };
      }
      const updateReservation =
        await this.reservationRepository.updateReservation(
          reservationId,
          startDate,
          endDate,
          petType,
          petSitterId,
          totalPrices,
        );
      if (updateReservation) {
        return { status: 200, message: '예약 수정 성공' };
      } else if (!updateReservation) {
        return { status: 400, message: '예약 수정 실패' };
      }
    } catch (err) {
      console.log(err);

      return { status: 500, message: 'Server Error' };
    }
  };

  // 예약 취소
  deleteReservation = async (userId, reservationId) => {
    // 취소 권한 조회
    const reservationData = await this.reservationRepository.viewOneReservation(
      reservationId,
    );
    try {
      if (!reservationData) {
        return { status: 400, message: '존재하지 않는 예약 정보입니다.' };
      } else if (userId != reservationData.userId) {
        return { status: 400, message: '예약 취소 권한이 없습니다.' };
      }

      const deleteReservation =
        await this.reservationRepository.deleteReservation(reservationId);
      if (deleteReservation) {
        return { status: 200, message: '예약 취소 성공' };
      } else if (!deleteReservation) {
        return { status: 400, message: '예약 취소 실패' };
      }
    } catch {
      return { status: 500, message: 'Server Error' };
    }
  };
}

module.exports = ReservationService;
