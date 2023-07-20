const PetSitterInfoRepository = require('../repositories/petSitterInfoRepository.js');
const UserRepository = require('../repositories/userRepository.js');
const careerCalculation = require('../utils/dateCalculationUtil.js');
const { Users, Reservations } = require('../models');
const { Op } = require('sequelize');

class PetSitterInfoService {
  petSitterInfoRepository = new PetSitterInfoRepository();
  userRepository = new UserRepository();

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
      const canEndReservationDate = new Date('July 25, 2023 23:59:59'); // canStartReservationDate + 90일
      const canStartReservationDate = new Date('July 19, 2023 23:59:59'); // 현재 날짜 다음날
      const petSitterData = await this.petSitterInfoRepository.findOnePetSitter(
        {
          where: { id },
          include: [
            {
              as: 'petSitterUserInfo',
              model: Users,
              attributes: ['name'],
            },
            {
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

      const career = careerCalculation(petSitterData.career);

      const petSitter = {
        name: petSitterData.petSitterUserInfo.name,
        petSitterId: petSitterData.id,
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
