const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function stringInvalid(string) {
    if( string == undefined || string.length === 0 )
     return true;
     
    return false;
}

const postUser = async (req, res, next) => {
    try {
        console.log('inside post');
  
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;

        if(phone == undefined || stringInvalid(name) || stringInvalid(email) ||  stringInvalid(password))
            return res.status(400).json({success: false, message: "Bad parameters. Some details are missing"});

        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async(err, hash) => {
            console.log(err);
            const created = await User.create( {name: name, email: email, phone: phone, password: hash});
            //if(!created)
               // return res.status(500).json({success: false, message: "User already exists.Please login"})
            res.status(201).json({success: true, message: "Successfully created new user"});
        })
    } catch(err) {
        return res.status(500).json({success: false, message: err})
    }
};

function generateAccessToken (id, name, isPremiumUser) {
    return jwt.sign({userId: id, name: name, isPremiumUser: isPremiumUser}, process.env.SECRETKEY)
}

async function postLogin (req, res, next) {
    try {
        console.log('inside post');
 
        const email = req.body.email;
        const password = req.body.password;

        if(stringInvalid(email) || stringInvalid(password))
            return res.status(400).json({message: "Email id or password is  missing", success: false});

        const user = await User.findAll({ where: { email: email }})
        if( user.length > 0 ) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(err)
                    throw new Error ('Something went wrong')
                if(result === true)
                    return res.status(200).json({success: true, message: "User logged in successfully", token:generateAccessToken(user[0].id, user[0].name, user[0].isPremiumUser)})
                else    
                    return res.status(401).json({success: false, message: "Password is incorrect"})
            })
        } else {
            return res.status(404).json({success: false, message: "User does not exist"})   
        }
       
    } catch(err) {
        return res.status(500).json({success: false, message: err})
    }
};

module.exports = { generateAccessToken, postLogin, postUser };