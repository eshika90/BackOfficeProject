const { PetSitterInfos } = require('../models');

class PetSitterInfoRepository {
  // 펫시터 정보 전체 조회
  findAllPetSitter = async (findOption) => {
    const petSitters = await PetSitterInfos.findAll(findOption);
    return petSitters;
  };

  // 펫시터 정보 상세 조회
  findOnePetSitter = async (findOption) => {
    const petSitter = await PetSitterInfos.findOne(findOption);
    return petSitter;
  };
}

module.exports = PetSitterInfoRepository;
