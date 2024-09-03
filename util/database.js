const SequelizeInstance = require('sequelize')
const sequelize = new SequelizeInstance('node-complete', 'root', 'nodecomplete',
    { dialect: 'mysql', host: 'localhost' }
)

module.exports = sequelize