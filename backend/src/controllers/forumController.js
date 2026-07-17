const Post = require('../models/Post');
const { uploadToCloudinary } = require('../utils/uploadHelper');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name role')
      .populate('expertAuthor', 'name role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file);
    }

    const post = await Post.create({
      title,
      content,
      imageUrl,
      user: req.user.id,
    });

    const populated = await Post.findById(post._id).populate('user', 'name role');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on post
// @route   POST /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const isLiked = post.likes.includes(req.user.id);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json({ success: true, likesCount: post.likes.length, isLiked: !isLiked });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
exports.commentPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = {
      user: req.user.id,
      userName: req.user.name,
      text: req.body.text,
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({ success: true, data: post.comments });
  } catch (error) {
    next(error);
  }
};

// @desc    Expert verified answer submit
// @route   POST /api/posts/:id/expert-answer
// @access  Private (Expert or Admin only)
exports.expertAnswerPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.expertAnswer = req.body.answer;
    post.expertAuthor = req.user.id;
    await post.save();

    const updated = await Post.findById(post._id)
      .populate('user', 'name role')
      .populate('expertAuthor', 'name role');

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
