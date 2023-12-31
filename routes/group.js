const path = require('path');

const express = require('express');

const groupController = require('../controllers/group');

const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.get('/get-groups', userAuthentication.authenticate, groupController.getGroups);

router.post('/add-group', userAuthentication.authenticate, groupController.createGroup);

router.post('/add-groupMembers', userAuthentication.authenticate, groupController.addGroupMembers);

router.post('/remove-groupMembers', userAuthentication.authenticate, groupController.removeGroupMembers);

router.post('/make-admin', userAuthentication.authenticate, groupController.makeAdmin);

router.get('/isAdmin', userAuthentication.authenticate, groupController.checkAdmin);



module.exports = router;