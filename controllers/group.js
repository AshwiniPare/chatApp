const Chat = require('../models/chat');
const User = require('../models/user');
const Group = require('../models/group');
const { Op } = require("sequelize");
const UserGroup = require('../models/userGroup');

function stringInvalid(string) {
    if( string == undefined || string.length === 0 )
     return true;
     
    return false;
}

exports.getGroups = async(req, res, next) => {
    try {
        const groups = await Group.findAll({});
        res.status(200).json({
            allGroups: groups
        });
    }catch(err) {
        res.status(500).json({error: err, success: false})
    }
}

exports.createGroup = async(req, res, next) => {
    try {
        console.log('create group method ', req.user.id);
        const adminId = req.user.id;
        const groupName = req.body.groupName;
        const members = req.body.members;

        if(stringInvalid(groupName)) {
            return res.status(400).json({success: false, message:'Input missing'});
        }
       const group = await Group.create( { name: groupName, createdBy: adminId});
       const users = await User.findAll( {
        where: {id: members}
       })
       await group.setUsers(users);
      
        res.status(201).json({newGroup: group, success: true});
    } catch(err) {
        res.status(500).json({error: err, success: false})
    }
}
