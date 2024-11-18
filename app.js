const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect
const mongoose = require('mongoose')
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const User = require('./models/user')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    User.findById('673b8852a7eaf1f84ccdc05b')
        .then(user => {
            if (!user) {
                throw new Error("User not found");
            }
            //full mongoose user, so can use all fn
            req.user = user
            next();
        })
        .catch(err => {
            console.error("Error fetching user:", err);
            next(err);
        });


})
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
mongoose.connect('mongodb+srv://yadavpranjali1223:xfhsWKnmLqenYFRX@cluster0.epngj.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
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
