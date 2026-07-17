const express = require('express');
const router = express.Router();
const {
  getPosts,
  createPost,
  likePost,
  commentPost,
  expertAnswerPost,
} = require('../controllers/forumController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../utils/uploadHelper');

// Secure all forum routes
router.use(protect);

router
  .route('/')
  .get(getPosts)
  .post(upload.single('image'), createPost);

router.post('/:id/like', likePost);
router.post('/:id/comment', commentPost);
router.post('/:id/expert-answer', authorize('expert', 'admin'), expertAnswerPost);

module.exports = router;
