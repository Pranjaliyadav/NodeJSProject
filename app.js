const path = require('path');
const session = require('express-session')
const express = require('express');
const bodyParser = require('body-parser');
const MongoDBStore = require('connect-mongodb-session')(session)

const errorController = require('./controllers/error');
const mongoose = require('mongoose')
const MONGODB_URI = 'mongodb+srv://yadavpranjali1223:xfhsWKnmLqenYFRX@cluster0.epngj.mongodb.net/shop?w=majority&appName=Cluster0'
const app = express();
const store = new MongoDBStore({
    //connectin strig, which db to store data
    uri : MONGODB_URI,
    //collection where session is store
    collection : 'sessions'
})

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const User = require('./models/user')



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//resave means - session will only be saved if something is changed in the session, not on every reload
app.use(session({secret : 'my secret', resave : false, saveUninitialized : false, store : store}))



app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)
app.use(errorController.get404);
mongoose.connect(MONGODB_URI)
    .then(result => {
        //find user if its already there, dont create new users again and again
        User.findOne().then(
            user => {
                if (!user) {

                    const user = new User({
                        name: 'Pranjali',
                        email: 'prnj@s.so',
                        cart: {
                            items: []
                        }
                    })
                    user.save()
                }
            }
        )
        app.listen(3000)
        console.log("connected to mongoose")
    }

    )
    .catch(err => {
        console.log("error connecting to mongoose", err)
    })
