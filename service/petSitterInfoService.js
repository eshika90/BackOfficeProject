const PetSitterInfoRepository = require('../repositories/petSitterInfoRepository.js');
const careerCalculation = require('../utils/dateCalculationUtil.js');
const { Users, Reservations } = require('../models');
const { Op } = require('sequelize');
//a
class PetSitterInfoService {
  petSitterInfoRepository = new PetSitterInfoRepository();

  // 펫시터 목록 조회
  findPetSitters = async () => {
    try {
      const petSitters = await this.petSitterInfoRepository.findAllPetSitter({
        attributes: ['id', 'homeType', 'summaryTitle', 'address', 'image'],
        include: [
          {
            as: 'petSitterUserInfo',
            model: Users,
            attributes: ['name'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      return {
        status: 200,
        petSitters,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Server Error',
      };
    }
  };

  // 펫시터 상세 조회
  findOnePetSitter = async (id) => {
    if (isNaN(id) || id < 1) {
      return {
        status: 404,
        message: '잘못된 id 입력값입니다.',
      };
    }

    try {
      // 예약 현황 조회 : 1일 후~90일 후
      const today = new Date();
      const canStartReservationDate = new Date(
        today.setDate(today.getDate() + 1),
      );
      const canEndReservationDate = new Date(
        today.setDate(today.getDate() + 91),
      );

      const petSitterData = await this.petSitterInfoRepository.findOnePetSitter(
        {
          where: { id },
          include: [
            {
              // 펫시터 이름
              as: 'petSitterUserInfo',
              model: Users,
              attributes: ['name', 'id'],
            },
            {
              // 펫시터 예약 현황
              separate: true,
              as: 'petSitterReservationInfo',
              model: Reservations,
              attributes: ['startDate', 'endDate'],
              where: {
                [Op.or]: [
                  {
                    startDate: {
                      [Op.between]: [
                        canStartReservationDate,
                        canEndReservationDate,
                      ],
                    },
                  },
                  {
                    endDate: {
                      [Op.between]: [
                        canStartReservationDate,
                        canEndReservationDate,
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      );

      if (!petSitterData) {
        return {
          status: 404,
          message: '존재하지 않는 펫시터입니다.',
        };
      }

      // 경력 계산
      const career = careerCalculation(petSitterData.career);

      const petSitter = {
        name: petSitterData.petSitterUserInfo.name,
        petSitterId: petSitterData.id,
        petSitterUserId: petSitterData.petSitterUserInfo.id,
        homeType: petSitterData.homeType,
        summaryTitle: petSitterData.summaryTitle,
        summary: petSitterData.summary,
        introduction: petSitterData.introduction,
        address: petSitterData.address,
        image: petSitterData.image,
        price: petSitterData.price,
        career,
        reservation: petSitterData.petSitterReservationInfo,
      };

      return {
        status: 200,
        petSitter,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: 'Server Error',
      };
    }
  };
}

module.exports = PetSitterInfoService;
