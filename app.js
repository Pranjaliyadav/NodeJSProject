
const express = require('express')
const bodyParser = require('body-parser')


const adminRoute = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(adminRoute)

app.use(shopRoutes)

app.listen(3000) 