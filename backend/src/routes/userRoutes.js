import express from 'express';
import protect from '../middleware/protect.js';
import userController from '../controllers/userController.js';

const router = express.Router();

// Register
router.post('/register', userController.register);

// Login
router.post('/login', userController.login);

// Get Details
router.get('/profile', protect, userController.getUserDetails);

// Change Password 
router.patch('/profile/update-password', protect, userController.changePassword);

export default router;