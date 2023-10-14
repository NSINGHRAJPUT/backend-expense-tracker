const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense', 'root', 'N', { dialect: 'mysql', host: 'localhost' });

module.exports = sequelize;
