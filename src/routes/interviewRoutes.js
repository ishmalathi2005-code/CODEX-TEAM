const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const interviewController = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

const createRules = [
  body('title').trim().notEmpty().withMessage('Interview title is required'),
  body('type').isIn(['technical', 'behavioral', 'mixed', 'coding', 'system-design']).withMessage('Invalid interview type'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('durationMinutes').optional().isInt({ min: 5, max: 180 }).withMessage('Duration must be between 5 and 180 minutes'),
];

router.post('/', createRules, validate, interviewController.createInterview);
router.get('/', interviewController.getMyInterviews);
router.get('/:id', interviewController.getInterviewById);
router.put('/:id', interviewController.updateInterview);
router.delete('/:id', interviewController.deleteInterview);
router.post('/:id/start', interviewController.startInterview);
router.post('/:id/end', interviewController.endInterview);

module.exports = router;
