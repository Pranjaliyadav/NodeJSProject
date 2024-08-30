const express = require('express')
const path = require('path')

const router = express.Router()
const rootDir = require('../utils/path')
const adminData = require('./admin')

router.get('/', (req, res, next) => {
    console.log("In random page", adminData.products)
    const products = adminData.products

    //inject data in template
    res.render('shop',{prods : products, docTitle : 'Shop'} )
})

module.exports = router