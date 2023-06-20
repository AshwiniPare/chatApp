const path = require('path');

const express = require('express');

const chatController = require('../controllers/chat');

const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.get('/get-chat', userAuthentication.authenticate, chatController.getChat);

router.post('/add-message', userAuthentication.authenticate, chatController.insertChat);


module.exports = router;