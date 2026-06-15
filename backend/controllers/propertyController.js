const Property = require('../models/Property');

// @desc    Create a property
// @route   POST /api/properties
const createProperty = async (req, res) => {
  try {
    const { 
      title, description, price, 
      city, country, propertyType, 
      imageUrls, listingType 
    } = req.body;

    // Validate fields
    if (!title || !description || !price || 
        !city || !country || !propertyType || !listingType) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    const property = await Property.create({
      title,
      description,
      price,
      city,
      country,
      propertyType,
      imageUrls: imageUrls || [],
      listingType,
      author: req.user._id
    });

    res.status(201).json(property);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all properties (public) with search/filter
// @route   GET /api/properties
const getAllProperties = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, propertyType, listingType } = req.query;

    // Build filter object dynamically
    let filter = {};

    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }
    if (propertyType) {
      filter.propertyType = propertyType;
    }
    if (listingType) {
      filter.listingType = listingType;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(filter)
      .populate('author', 'username email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(properties);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('author', 'username email avatar phone');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json(property);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user properties
// @route   GET /api/properties/my-listings
const getMyListings = async (req, res) => {
  try {
    const properties = await Property.find({ author: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(properties);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership
    if (property.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to update this property' 
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedProperty);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership
    if (property.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this property' 
      });
    }

    await property.deleteOne();

    res.status(200).json({ message: 'Property deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  getMyListings,
  updateProperty,
  deleteProperty
};