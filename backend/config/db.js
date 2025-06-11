const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('finance_tracker', 'your_piyush', 'piyush', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
