const SequelizeInstance = require('sequelize')
const sequelize = new SequelizeInstance('node-complete', 'root', 'password',
    { dialect: 'mysql', host: 'localhost' }
)

module.exports = sequelize