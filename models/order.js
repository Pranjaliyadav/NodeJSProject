const SequelizeInstance = require('sequelize')

const sequelize = require('../util/database')

//creating Order table
const OrderModel = sequelize.define('order', {
    id: {
        type: SequelizeInstance.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
})

module.exports = OrderModel