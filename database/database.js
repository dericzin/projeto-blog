const Sequelize = require('sequelize');


const connection = new Sequelize('projeto-blog','root','Milly2021',{
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    timezone: "-03:00"
});

module.exports = connection;