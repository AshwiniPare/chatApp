const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Forgotpassword = require('../models/forgotPassword');

exports.forgotpassword = async (req, res) => {
    try {
        const email=  req.body.email;
        const user = await User.findOne({where : { email }});
        if(user){
           const id = uuid.v4();
           console.log("forgot password id is "+id);
           await Forgotpassword.create({id: id, userId: user.id, active: true})
            sgMail.setApiKey(process.env.SENGRID_API_KEY)

            const msg = {
                to: 'ashwinipbhatt@gmail.com', // Change to your recipient
                from: 'yj.rocks.2411@gmail.com', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
            }

            sgMail
            .send(msg)
            .then((response) => {

                // console.log(response[0].statusCode)
                // console.log(response[0].headers)
                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

            })
            .catch((error) => {
                throw new Error(error);
            })

            //send mail
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

exports.resetPassword = async (req, res) => {
    try {
        const id = req.params.id;
        const forgotPasswordRequest = await Forgotpassword.findOne({ where: { id }});
        if(forgotPasswordRequest) {
          await forgotPasswordRequest.update({ active: false});
                res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()
        }
    } catch(err) {
        console.log(err);
    }
}

exports.updatePassword = async(req, res) => {
    try {
        const {newpassword} = req.query;
        const {resetPasswordId} = req.params;
        const resetPasswordRequest = await Forgotpassword.findOne({ where : {id: resetPasswordId}})
        const user = await User.findOne({where : { id: resetPasswordRequest.userId}})
        if(user) {
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function(err, salt){
                if(err) {
                    console.log(err);
                    throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, async function(err, hash){
                    if(err) {
                        console.log(err);
                        throw new Error(err);
                    }
                    await user.update({ password: hash});
                    res.status(201).json({ message: 'Successfully updated the new passowrd'})
                });
            });
        } else {
            return res.status(404).json({ error: 'No user Exists', success: false})
        }

    }catch(err) {
        res.status(403).json({ error, success: false})
    }
}