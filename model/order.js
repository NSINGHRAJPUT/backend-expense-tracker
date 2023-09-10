const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    paymentId: Sequelize.STRING,
    orderId: Sequelize.STRING,
    staus: Sequelize.STRING
})

module.exports = Order;