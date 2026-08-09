const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', resultController.getMyResults);
router.get('/:interviewId', resultController.getResultByInterview);

module.exports = router;
