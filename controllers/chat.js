const Chat = require('../models/chat');
const User = require('../models/user');
const { Op } = require("sequelize");

function stringInvalid(string) {
    if( string == undefined || string.length === 0 )
     return true;
     
    return false;
}

exports.getChat = async(req, res, next) => {
    try {
        const lastMsgId = req.query.lastMsgId;

        const chats = await Chat .findAll({
           where: { id:  {
            [Op.gt]: lastMsgId
        }},
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            order:[['id', 'ASC']],
            include: { model: User, required: true,  attributes:['name'] }
        });

        res.status(200).json({
            allChats: chats
        });

    } catch(error) {
        console.log('Get Chat is failing '+ JSON.stringify(error));
        res.status(500).json({ error: error});
    }
}

exports.insertChat = async(req, res, next) => {
    try {
        console.log('inert chat method', req.user.id);
        const userId = req.user.id;
        const msg = req.body.msg;

        if(stringInvalid(msg)) {
            return res.status(400).json({success: false, message:'Input missing'});
        }
       const data = await Chat.create( { message: msg, userId: userId});
        res.status(201).json({newChat: data, success: true});
    } catch(err) {
        res.status(500).json({error: err, success: false})
    }
}
