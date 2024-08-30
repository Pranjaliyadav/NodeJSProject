
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended : false}))

app.use('/add-product', (req, res, next) => {
    console.log("In add product page")
    res.send('<form action="/product" method = "POST" ><input type="text" name=  "title"><button type="submit">Submit</button></form>')
})

//app.get for fiktering get request, app.post for post request

app.post('/product', (req, res, next) => {
    console.log("In product page", req.body)
    // res.send("<h1>Hello another</h1>")
    res.redirect('/')
})

app.use('/', (req, res, next) => {
    console.log("In random page")
    res.send("<h1>Hello random page</h1>")
})

app.listen(3000) 