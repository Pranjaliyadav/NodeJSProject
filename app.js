
const express = require('express')
const bodyParser = require('body-parser')


const adminRoute = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(adminRoute)

app.use(shopRoutes)

app.use((req, res, next)=>{
    //for handling incorrect routes
    res.status(404).send('<h1>Page not found!</h1>')
})

app.listen(3000) 