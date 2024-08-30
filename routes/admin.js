const express = require('express')
const path = require('path')
const router = express.Router()

const rootDir = require('../utils/path')

const products = []

router.get('/add-product', (req, res, next) => {
    console.log("In random page")
    res.render('add-product', {pageTitle : 'Add Product'})
})

router.post('/add-product', (req, res, next) => {
    products.push({title : req.body.title})
    console.log("In product page",products)
    res.redirect('/')
})

exports.routes = router
exports.products = products