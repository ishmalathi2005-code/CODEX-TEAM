const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const interviewController = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

router.use(protect);

const createRules = [
  body('title').optional().trim(),
  body('type').optional().customSanitizer(v => String(v || 'technical').toLowerCase()),
  body('difficulty').optional().customSanitizer(v => String(v || 'medium').toLowerCase()),
  body('durationMinutes').optional().toInt(),
];

router.post('/', createRules, validate, interviewController.createInterview);
router.get('/', interviewController.getMyInterviews);
router.get('/:id', interviewController.getInterviewById);
router.put('/:id', interviewController.updateInterview);
router.delete('/:id', interviewController.deleteInterview);
router.post('/:id/start', interviewController.startInterview);
router.post('/:id/end', interviewController.endInterview);

module.exports = router;
