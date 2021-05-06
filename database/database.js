const Sequelize = require('sequelize');

const connection = new Sequelize('projetoblog','dericth','thiagoderic1',{
    host: 'mysql743.umbler.com',
    dialect: 'mysql',
    logging: false,
    timezone: "-03:00"
});

module.exports = connection;