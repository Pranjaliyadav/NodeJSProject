const SequelizeInstance = require('sequelize')

const sequelize = require('../util/database')

//creating Cart table
const CartModel = sequelize.define('cart', {
    id: {
        type: SequelizeInstance.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
})

module.exports = CartModel