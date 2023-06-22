const path = require('path');

const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post('/add-user', userController.postUser);

router.post('/login', userController.postLogin);

router.get('/get-users', userController.getUsers);
module.exports = router;