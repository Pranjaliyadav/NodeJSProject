const express = require('express')

const router = express.Router()

router.get('/add-product', (req, res, next) => {
    console.log("In add product page")
    res.send('<form action="/admin/add-product" method = "POST" ><input type="text" name=  "title"><button type="submit">Add Product</button></form>')
})


router.post('/add-product', (req, res, next) => {
    console.log("In product page", req.body)
    // res.send("<h1>Hello another</h1>")
    res.redirect('/')
})

module.exports = router