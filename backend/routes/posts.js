const express = require('express');
const {
  createPost, getPosts, deletePost, likePost, commentPost, deleteComment
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, createPost);
router.get('/', getPosts);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentPost);
router.delete('/:postId/comment/:commentId', protect, deleteComment);

module.exports = router;
