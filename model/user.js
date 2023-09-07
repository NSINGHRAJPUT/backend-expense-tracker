const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const user = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        uniqueKey: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = user;