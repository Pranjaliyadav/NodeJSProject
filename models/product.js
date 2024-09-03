const SequelizeInstance = require('sequelize')

const sequelize = require('../util/database')

//creating Product table
const Product = sequelize.define('product', {
  id: {
    type: SequelizeInstance.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title:
  {
    type: SequelizeInstance.STRING,
    allowNull: false
  },
  price: {
    type: SequelizeInstance.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: SequelizeInstance.STRING,
    allowNull: false
  },
  description: {
    type: SequelizeInstance.STRING,
    allowNull: false
  }
})