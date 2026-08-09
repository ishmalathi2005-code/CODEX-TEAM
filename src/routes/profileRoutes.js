const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect); // All profile routes require auth

router.get('/me', profileController.getMyProfile);
router.put('/me', profileController.updateMyProfile);
router.get('/:id', authorize('admin'), profileController.getProfileById);

module.exports = router;
