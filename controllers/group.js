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
        const  user = await User.findByPk(req.user.id);
        const groups = await user.getGroups();
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

       const result = await UserGroup.update(
            {
                isAdmin: true
            },
            {  where:  {
                userId:  req.user.id,
                groupId: group.id
            }
        })

        res.status(201).json({newGroup: group, success: true});
    } catch(err) {
        res.status(500).json({error: err, success: false})
    }
}

exports.addGroupMembers = async(req, res, next) => {
    try{
        const  group = await Group.findByPk(req.body.groupId);
        const users = await User.findAll( {
            where: {id: req.body.members}
           })
         const result =  await group.addUsers(users);
    
        res.status(200).json({
            allUsers: users
        });
    }catch(err) {
        return res.status(500).json({success: false, message: err})
    }
}

exports.removeGroupMembers = async(req, res, next) => {
    try{
        const users = await UserGroup.destroy({
            where:  {
                userId: req.body.members,
                groupId: req.body.groupId
            }
        })

        res.status(200).json({
            allUsers: users
        });
    }catch(err) {
        return res.status(500).json({success: false, message: err})
    }
}

exports.checkAdmin = async(req, res, next) => {
    try {
        const groupId = req.query.groupId;
        const  user = await User.findByPk(req.user.id);

          const result = await UserGroup.findOne(
            {  where:  {
                userId:  req.user.id,
                groupId: groupId
            }
        })
        res.status(200).json({
            isAdmin: result
        });
    }catch(err) {
        res.status(500).json({error: err, success: false})
    }
}

exports.makeAdmin = async(req, res, next) => {
    try {
        const result = await UserGroup.update(
            {
                isAdmin: true
            },
            {  where:  {
                 userId: req.body.members,
                groupId: req.body.groupId
            }
        })
        res.status(200).json({
            isAdmin: result
        });
    }catch(err) {
        res.status(500).json({error: err, success: false})
    }
}