const express = require('express');
const { register, login, getMe, updateUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update', protect, upload.single('profileImage'), updateUser);

module.exports = router;
