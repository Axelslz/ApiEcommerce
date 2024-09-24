const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.put('/profile', authMiddleware, UserController.updateProfile);
router.post('/forgot-password', UserController.requestPasswordReset);
router.post('/reset-password', UserController.resetPassword);

module.exports = router;
