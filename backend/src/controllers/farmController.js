const Farm = require('../models/Farm');
const { uploadToCloudinary } = require('../utils/uploadHelper');

// @desc    Get all farms for logged-in user
// @route   GET /api/farms
// @access  Private
exports.getFarms = async (req, res, next) => {
  try {
    const farms = await Farm.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: farms.length, data: farms });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single farm
// @route   GET /api/farms/:id
// @access  Private
exports.getFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({ _id: req.params.id, user: req.user.id });
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }
    res.json({ success: true, data: farm });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new farm
// @route   POST /api/farms
// @access  Private
exports.createFarm = async (req, res, next) => {
  try {
    // Add user to body
    req.body.user = req.user.id;

    const farm = await Farm.create(req.body);
    res.status(201).json({ success: true, data: farm });
  } catch (error) {
    next(error);
  }
};

// @desc    Update farm
// @route   PUT /api/farms/:id
// @access  Private
exports.updateFarm = async (req, res, next) => {
  try {
    let farm = await Farm.findOne({ _id: req.params.id, user: req.user.id });
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    farm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: farm });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete farm
// @route   DELETE /api/farms/:id
// @access  Private
exports.deleteFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({ _id: req.params.id, user: req.user.id });
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    await farm.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload farm image
// @route   POST /api/farms/upload
// @access  Private
exports.uploadFarmImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const imageUrl = await uploadToCloudinary(req.file);
    res.json({ success: true, imageUrl });
  } catch (error) {
    next(error);
  }
};
