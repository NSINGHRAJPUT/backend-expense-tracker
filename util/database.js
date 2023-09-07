const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense', 'root', 'Nr@011297', { dialect: 'mysql', host: 'localhost' });

module.exports = sequelize;