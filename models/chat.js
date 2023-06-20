const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Chat = sequelize.define('chat', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
   // userId: Sequelize.INTEGER,
    message:  {
        type: Sequelize.STRING,
        require: true
    }
});

module.exports = Chat;
