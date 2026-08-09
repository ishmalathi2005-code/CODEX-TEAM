const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', historyController.getHistory);
router.get('/stats', historyController.getStats);

module.exports = router;
