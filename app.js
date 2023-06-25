require('dotenv').config();
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketIO = require('socket.io');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const User = require('./models/user');
const Chat = require('./models/chat');
const Group = require('./models/group');
const UserGroup = require('./models/userGroup');
//const ForgotPassword = require('./models/forgotPassword');
const cors = require('cors');
//const helmet = require('helmet');
//const morgan = require('morgan');

const app = express();

app.use(cors({
  origin: '*'
}));

const server = http.createServer(app);
const io = socketIO(server);

const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
   users[socket.id] = name
  })

  socket.on('join-group', (groupId) => {
    socket.join(groupId);
  })

  socket.on('send-chat-message', (message,groupId) => {
    //io to inform all the sockets in the group
   io.to(groupId).emit('chat-message', { message: message, name: users[socket.id] })
 
  })
  socket.on('disconnect', () => {
    delete users[socket.id]
  })

});

//const privateKey = fs.readFileSync('server.key');
//const certificate = fs.readFileSync('server.cert');


const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const groupRoutes = require('./routes/group');
const { group } = require('console');
//const resetPasswordRoutes = require('./routes/resetPassword');
//const { reset } = require('nodemon');

/*const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'),
{
  flags: 'a'
});
*/
//app.use(helmet());
//app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/group', groupRoutes);

//app.use('/password', resetPasswordRoutes);

app.use((req, res) => {
  console.log('url is....', req.url);
  res.sendFile(path.join(__dirname, `public/${req.url}`))
});


//User.hasMany(ForgotPassword);
//ForgotPassword.belongsTo(User);

User.hasMany(Chat);
Chat.belongsTo(User)

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, {through: UserGroup});

Group.hasMany(Chat);
Chat.belongsTo(Group);

app.use(errorController.get404);

sequelize.sync().then(result => {
    console.log(result);
   // https.createServer({key: privateKey, cert: certificate }, app).listen(process.env.PORT || 3000);
    server.listen(process.env.PORT || 3000);
})
.catch(err => {
    console.log(err);
});

