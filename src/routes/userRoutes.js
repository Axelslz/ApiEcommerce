const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController'); 
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer ({ storage: storage});

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgot-password', UserController.requestPasswordReset);  
router.put('/reset-password/:token', UserController.resetPassword);  
router.put('/update/:id', upload.single('profile_picture'), UserController.updateUser);

module.exports = router;


