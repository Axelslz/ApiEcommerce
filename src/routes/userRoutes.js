const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController'); 


router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgot-password', UserController.requestPasswordReset);  
router.put('/reset-password/:token', UserController.resetPassword);  

module.exports = router;


