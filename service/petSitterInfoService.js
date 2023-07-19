const PetSitterInfoRepository = require('../repositories/petSitterInfoRepository.js');
const UserRepository = require('../repositories/userRepository.js');

class PetSitterInfoService {
  petSitterInfoRepository = new PetSitterInfoRepository();
  userRepository = new UserRepository();

  // 펫시터 목록 조회
  findPetSitters = async () => {
    try {
      const petSitters = await this.petSitterInfoRepository.findAllPetSitter({
        attributes: ['id', 'homeType', 'summaryTitle', 'address', 'image'],
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
      const petSitterData = await this.petSitterInfoRepository.findOnePetSitter(
        { where: { id } },
      );

      if (!petSitterData) {
        return {
          status: 404,
          message: '존재하지 않는 펫시터입니다.',
        };
      }

      const petSitter = {
        petSitterId: petSitterData.id,
        homeType: petSitterData.homeType,
        summaryTitle: petSitterData.summaryTitle,
        summary: petSitterData.summary,
        introduction: petSitterData.introduction,
        address: petSitterData.address,
        image: petSitterData.image,
        price: petSitterData.price,
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