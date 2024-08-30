const express = require('express')
const path = require('path')
const router = express.Router()

router.get('/add-product', (req, res, next) => {
    console.log("In random page")
    res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'))
})

router.post('/add-product', (req, res, next) => {
    console.log("In product page", req.body)
    // res.send("<h1>Hello another</h1>")
    res.redirect('/')
})

module.exports = router