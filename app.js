const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database')
const ProductModel = require('./models/product')
const UserModel = require('./models/user')
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

ProductModel.belongsTo(UserModel,{constraints : true, onDelete : 'CASCADE'})
//these params define that if anything happend sto user record, product related record will also be affected

UserModel.hasMany(ProductModel)


//sync table with db
sequelize.sync({force : true}).then(result => {
    app.listen(3000);
})
    .catch(error => console.error(error))

