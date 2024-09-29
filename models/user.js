const SequelizeInstance = require('sequelize')

const sequelize = require('../util/database')

//creating User table
const User = sequelize.define('user', {
    id: {
        type: SequelizeInstance.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:
    {
        type: SequelizeInstance.STRING,
        allowNull: false
    },
    email:
    {
        type: SequelizeInstance.STRING,
        allowNull: false
    },
   
})

module.exports = User

//id, name, email