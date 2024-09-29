const SequelizeInstance = require('sequelize')

const sequelize = require('../util/database')

//creating Cart item table
const CartItemModel = sequelize.define('cartItem', {
    id: {
        type: SequelizeInstance.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: { type: SequelizeInstance.INTEGER }
})

module.exports = CartItemModel