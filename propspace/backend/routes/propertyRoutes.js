const express = require('express');
const router = express.Router();
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  getMyListings,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllProperties);

// Protected routes
router.post('/', protect, createProperty);
router.get('/user/my-listings', protect, getMyListings);

// Must come AFTER /user/my-listings to avoid swallowing it as :id
router.get('/:id', getPropertyById);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;