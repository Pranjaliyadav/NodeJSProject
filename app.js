const path = require('path');
require('dotenv').config();
const session = require('express-session')
const express = require('express');
const bodyParser = require('body-parser');
const MongoDBStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')
const errorController = require('./controllers/error');
const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGO_DB_CONNECTION_STRING
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const User = require('./models/user')


const store = new MongoDBStore({
    //connectin strig, which db to store data
    uri: MONGODB_URI,
    //collection where session is store
    collection: 'sessions'
})
app.use(flash())


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//resave means - session will only be saved if something is changed in the session, not on every reload
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }))

app.use((req, res, next) => {
    if (!req.session.user) {
       return next()
    }
    User.findById(req.session.user._id)
        .then(
            user => {
                if(!user){
                    return next()
                }
                req.user = user
                next()
            }
        )
        .catch(err => {
            throw new Error(err)
        })
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)
app.use('/500',errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next)=>{
    // res.redirect('/500')
  res.status(500).render('500', { pageTitle: 'Internal Server Error', path: '/500', isAuthenticated : req.session.isLoggedIn });

})

mongoose.connect(MONGODB_URI)
    .then(result => {
    
        app.listen(3000)
        console.log("connected to mongoose")
    }

    )
    .catch(err => {
        console.log("error connecting to mongoose", err)
    })
