const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Forgotpassword = sequelize.define('forgotpassword', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    isActive: Sequelize.BOOLEAN
})

module.exports = Forgotpassword;