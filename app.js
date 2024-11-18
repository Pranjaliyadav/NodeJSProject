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

// const User = require('./models/user')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use((req, res, next) => {
//     User.findById('6738b57f5e3b179959b57467')
//     .then(user => {
//         if (!user) {
//             throw new Error("User not found");
//         }
//         req.user = new User(user.name, user.email, user.cart, user._id);
//         next();
//     })
//     .catch(err => {
//         console.error("Error fetching user:", err);
//         next(err);
//     });


// })
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
mongoose.connect('mongodb+srv://yadavpranjali1223:xfhsWKnmLqenYFRX@cluster0.epngj.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
.then( result => {
    app.listen(3000)
    console.log("connected to mongoose")
}
    
)
.catch(err => {
    console.log("error connecting to mongoose", err)
})
