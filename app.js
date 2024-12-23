const path = require('path');
const fs = require('fs')
require('dotenv').config();
const session = require('express-session')
const express = require('express');
const bodyParser = require('body-parser');
const MongoDBStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')
const errorController = require('./controllers/error');
const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGO_DB_CONNECTION_STRING
const multer = require('multer')
const helmet = require('helmet')
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const compression = require('compression')
const User = require('./models/user')
const morgon = require('morgan')

const app = express();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags : 'a'}
) //logs will be saved in this file

app.use(helmet()) //this adds headers
app.use(compression()) //compress code for optimzation, css and js will be compressed only
app.use(morgon('combined', {stream : accessLogStream})) //display browser details with every call of apis

const store = new MongoDBStore({
    //connectin strig, which db to store data
    uri: MONGODB_URI,
    //collection where session is store
    collection: 'sessions'
})

app.use(flash())

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // const uploadPath = path.join(__dirname, 'images'); // Ensure the full path is correct
        cb(null, 'images'); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, 'image-' + Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

// File filter for specific MIME types
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' ||file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ){

        cb(null, true)
    }
    else{
        cb(null, false)

    }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
//resave means - session will only be saved if something is changed in the session, not on every reload
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }))

app.use(multer({storage : fileStorage , fileFilter : fileFilter}).single('image')) //for parsing image
// app.use(multer({dest : 'images'}).single('image')) 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));

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

app.use((error, req, res, next) => {
    console.error( "file error",error); // Log the error for debugging
    res.status(500).render('500', {
        pageTitle: 'Internal Server Error',
        path: '/500',
        isAuthenticated: req.session ? req.session.isLoggedIn : false, // Safeguard
    });
});
mongoose.connect(MONGODB_URI)

    .then(result => {
    
        app.listen(3000)
        console.log("connected to mongoose")
    }

    )
    .catch(err => {
        console.log("error connecting to mongoose", err)
    })
