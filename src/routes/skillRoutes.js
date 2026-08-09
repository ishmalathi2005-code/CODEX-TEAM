const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/recommendations', skillController.getRecommendations);
router.get('/gaps', skillController.getSkillGaps);

module.exports = router;
