const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const questionController = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

const createRules = [
  body('text').trim().notEmpty().withMessage('Question text is required'),
  body('type').isIn(['technical', 'behavioral', 'coding', 'system-design', 'mcq']).withMessage('Invalid question type'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
];

router.post('/generate', questionController.generateQuestions);
router.post('/', authorize('admin'), createRules, validate, questionController.createQuestion);
router.get('/', questionController.getQuestions);
router.get('/:id', questionController.getQuestionById);
router.put('/:id', authorize('admin'), questionController.updateQuestion);
router.delete('/:id', authorize('admin'), questionController.deleteQuestion);

module.exports = router;
