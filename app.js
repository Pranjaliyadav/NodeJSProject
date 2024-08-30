
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const adminRoute = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const expressHbs = require('express-handlebars')


const app = express()

app.engine('hbs', expressHbs()) //initialises engine

//set global config values
app.set('view engine', 'hbs') //use this handlebars template engine
app.set('views', 'views')

//serve static files with this like CSS
app.use(express.static(path.join(__dirname, 'public')))


app.use(bodyParser.urlencoded({ extended: false }))

app.use('/admin', adminRoute.routes) //only routes starting with /admin will go in adminRoutes

app.use(shopRoutes)

app.use((req, res, next)=>{
    //for handling incorrect routes
     res.status(404).render('404')

})

app.listen(3000) 