const path = require('path');

const express = require('express');

const groupController = require('../controllers/group');

const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.get('/get-groups', userAuthentication.authenticate, groupController.getGroups);

router.post('/add-group', userAuthentication.authenticate, groupController.createGroup);



module.exports = router;