const SequelizeInstance = require('sequelize')

const sequelize = require('../util/database')

//creating OrderItem table
const OrderItemModel = sequelize.define('orderItem', {
    id: {
        type: SequelizeInstance.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: { type: SequelizeInstance.INTEGER }
})

module.exports = OrderItemModel