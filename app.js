const path = require('path'); //paht module
const fs = require('fs') //file module
require('dotenv').config(); //dotenv is required to use env variables
const session = require('express-session') //to create sessions for users activities
const express = require('express'); 
const bodyParser = require('body-parser'); //body-parser is a lib. used with express to parse incoming request bodies with url-encoded payloads
const MongoDBStore = require('connect-mongodb-session')(session) //to integrate mongoDb as a session store in nodejs app using express-session
const flash = require('connect-flash') //lib to display flash messages
const errorController = require('./controllers/error');
const mongoose = require('mongoose') //orm for handling mongodb
const MONGODB_URI = process.env.MONGO_DB_CONNECTION_STRING
const multer = require('multer') //to handle multipart/form-data which is primarily used for uploading files in nodejs app
const helmet = require('helmet') //configures http headers to mitigte potential security risks, headers affect how browsers interact with your app
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const compression = require('compression') //compresses js css code optimises as well
const User = require('./models/user')
const morgon = require('morgan') //can log details lik request method, URL, status code, response time, and more


const app = express(); //creates instance of an express app. this app can be used to define routes, middleware, and other configuration for your web server

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags : 'a'} //means append mode, new entries will be added to end of the file without overwriting its contents
) //logs will be saved in this file

//app.use for mouting middlwaares fn or routes in express app
app.use(helmet()) //this adds headers
app.use(compression()) //compress code for optimzation, css and js will be compressed only
app.use(morgon('combined', {stream : accessLogStream})) //display browser details with every call of apis
//combined is a predefined logging format by morgan.
//whatever the log is coming, stream it to accessLogStream that we defined on line 24

//to store session data using ongodb as the session storage engine
const store = new MongoDBStore({
    //connectin strig, which db to store data
    uri: MONGODB_URI,
    //collection where session is store
    collection: 'sessions'
})

app.use(flash())

//diskstorage to specify how files should be stored on the disk, can customize destination and filename using this
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // const uploadPath = path.join(__dirname, 'images'); // Ensure the full path is correct
        cb(null, 'images'); // Directory where files will be stored, if folder doesnt exists it will need to be created manually or through the code
    },
    filename: (req, file, cb) => {
        cb(null, 'image-' + Date.now() + path.extname(file.originalname)); // Unique filename
        //path.extname(file.originalname) preserves original file's extension
    },
});

// File filter for specific MIME types, restrict upload
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' ||file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ){

        cb(null, true) //accept the file
    }
    else{
        cb(null, false) //reject the file

    }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
//resave means - session will only be saved if something is changed in the session, not on every reload
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }))

app.use(multer({storage : fileStorage , fileFilter : fileFilter}).single('image')) //for parsing image
//single means , only single file will be incoming, if multiple files needed, then write .array('image')
//image is the key name in http form 


app.use(express.static(path.join(__dirname, 'public'))); //configures static file serving in express app. tells express to serve static files like html css js, images from public directory
app.use('/images',express.static(path.join(__dirname, 'images'))); //static file serving with a specific url path prefix /images. this setup allows express to serve static files from images folder and files will be accessibble through URLs starts with /images

app.use((req, res, next) => { //req, res, next are standard 3 params 
    if (!req.session.user) {
       return next() //passes control to next middleware function or route handler
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

app.use((error, req, res, next) => { //middleware related to error
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
