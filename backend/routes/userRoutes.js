const express = require('express');
const router = express.Router();
const { 
  getUserProfile, 
  updateUserProfile, 
  changePassword 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All routes below are protected
// GET /api/users/profile
router.get('/profile', protect, getUserProfile);

// PUT /api/users/profile
router.put('/profile', protect, updateUserProfile);

// PUT /api/users/change-password
router.put('/change-password', protect, changePassword);

module.exports = router;