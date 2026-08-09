const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', evaluationController.triggerEvaluation);
router.post('/:interviewId', evaluationController.triggerEvaluation);
router.get('/:interviewId', evaluationController.getEvaluation);

module.exports = router;
