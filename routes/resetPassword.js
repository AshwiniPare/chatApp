const path = require('path');

const express = require('express');

const resetPasswordController = require('../controllers/resetPassword');

const authenticateMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/forgotPassword', resetPasswordController.forgotpassword);

router.get('/resetPassword/:id',resetPasswordController.resetPassword);

router.get('/updatePassword/:resetPasswordId', resetPasswordController.updatePassword);

module.exports = router; 