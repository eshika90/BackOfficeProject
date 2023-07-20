const express = require('express');
const router = express.Router();

const PetSitterInfoController = require('../controller/petSitterInfoController.js');
const petSitterInfoController = new PetSitterInfoController();

// 펫시터 목록 조회
router.get('/petSitterInfo', petSitterInfoController.getPetSitters);

// 펫시터 상세 조회
router.get('/petSitterInfo/:id', petSitterInfoController.getPetSitterById);

module.exports = router;
