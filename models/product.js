const SequelizeInstance = require('sequelize')

const sequelize = require('../util/database')

//creating Product table
const Product = sequelize.define('product', {
  id : {
    type : SequelizeInstance.INTEGER,
    autoCom
  }
})