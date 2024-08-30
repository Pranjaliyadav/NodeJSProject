
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const adminRoute = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const app = express()

//serve static files with this like CSS
app.use(express.static(path.join(__dirname, 'public')))


app.use(bodyParser.urlencoded({ extended: false }))

app.use('/admin', adminRoute) //only routes starting with /admin will go in adminRoutes

app.use(shopRoutes)

app.use((req, res, next)=>{
    //for handling incorrect routes
     res.status(404).sendFile(path.join(__dirname,  'views', '404.html'))

})

app.listen(3000) 