const express = require('express')

const router = express.Router()

router.get('/add-product', (req, res, next) => {
    console.log("In add product page")
    res.send('<form action="/product" method = "POST" ><input type="text" name=  "title"><button type="submit">Submit</button></form>')
})


router.post('/product', (req, res, next) => {
    console.log("In product page", req.body)
    // res.send("<h1>Hello another</h1>")
    res.redirect('/')
})

module.exports = router