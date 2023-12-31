const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:  {
        type: Sequelize.STRING,
        require: true
    },
    email:  {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: Sequelize.INTEGER,
        require: true
    },
    password:   {
        type: Sequelize.STRING,
        require: true
    }
});

module.exports = User;
