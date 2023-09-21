const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Report = sequelize.define('report', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    location: Sequelize.STRING
})

module.exports = Report;