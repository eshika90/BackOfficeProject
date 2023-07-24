const PetSitterInfoService = require('../service/petSitterInfoService.js');

class PetSitterInfoController {
  petSitterInfoService = new PetSitterInfoService();

  // 펫시터 목록 조회
  getPetSitters = async (req, res) => {
    const { status, message, petSitters } =
      await this.petSitterInfoService.findPetSitters();

    return res.status(status).json({ message, petSitters });
  };
  //a
  // 펫시터 상세 조회
  getPetSitterById = async (req, res) => {
    const { id } = req.params;

    const { status, message, petSitter } =
      await this.petSitterInfoService.findOnePetSitter(id);

    return res.status(status).json({ message, petSitter });
  };
}
module.exports = PetSitterInfoController;
