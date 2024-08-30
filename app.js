
const express = require('express')

const app = express()

app.use('/', (req, res, next) => {
    console.log("Alwys runs")
    next()
})
app.use('/add-product', (req, res, next) => {
    console.log("In add product page")
    res.send('<form action="/product" method = "POST" ><input type="text" name=  "title"><button type="submit">Submit</button></form>')
})

app.use('/product', (req, res, next) => {
    console.log("In product page", req.body)
    res.redirect('/')
    res.send("<h1>Hello another</h1>")
})

app.use('/', (req, res, next) => {
    console.log("In random page")
    res.send("<h1>Hello random page</h1>")
})

app.listen(3000) 