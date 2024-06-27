const express = require('express');
const {
  createPost, getPosts, getPost, updatePost, deletePost
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;