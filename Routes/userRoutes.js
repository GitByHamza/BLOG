const express = require('express');
const authController = require('../Controllers/authController');
const userController = require('../Controllers/userController');

const router = express.Router();

// --- Public Routes ---
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// --- Protected Routes ---
router.use(authController.protect);
router.get('/me', userController.getMe);
router.patch('/like/:blogId', userController.likeBlog);
router.patch('/save/:blogId', userController.saveBlog);

// --- Admin Routes ---
router.get('/', authController.restrictTo('admin'), userController.getAllUsers);

module.exports = router;
