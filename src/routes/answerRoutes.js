const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const answerController = require('../controllers/answerController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

const submitRules = [
  body('interviewId').notEmpty().withMessage('Interview ID is required'),
  body('questionId').notEmpty().withMessage('Question ID is required'),
];

router.post('/', submitRules, validate, answerController.submitAnswer);
router.get('/interview/:interviewId', answerController.getAnswersByInterview);
router.get('/:id', answerController.getAnswerById);

module.exports = router;
