const User = require('../models/User');
const Farm = require('../models/Farm');
const Post = require('../models/Post');
const AiLog = require('../models/AiLog');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
exports.updateUserRole = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot modify your own role' });
    }

    user.role = req.body.role || user.role;
    await user.save();

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account' });
    }

    await user.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform aggregates
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getPlatformStats = async (req, res, next) => {
  try {
    const usersCount = await User.countDocuments();
    const farmsCount = await Farm.countDocuments();
    const postsCount = await Post.countDocuments();
    const logsCount = await AiLog.countDocuments();

    res.json({
      success: true,
      data: {
        usersCount,
        farmsCount,
        postsCount,
        logsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
