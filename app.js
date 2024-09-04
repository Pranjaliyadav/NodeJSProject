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
const CartModel = require('./models/cart');
const CartItemModel = require('./models/cart-item');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    UserModel.findByPk(1)
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => console.log(err))
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//belongTo- product record will have 1 key common to usermodel, so data can be mapped

ProductModel.belongsTo(UserModel, { constraints: true, onDelete: 'CASCADE' })
//these params define that if anything happend sto user record, product related record will also be affected

UserModel.hasMany(ProductModel)
UserModel.hasOne(CartModel)
CartModel.belongsTo(UserModel)
CartModel.belongsToMany(ProductModel, {through : CartItemModel})
ProductModel.belongsToMany(CartModel, { through: CartItemModel })

//sync table with db
sequelize
    // .sync({force : true})
    .sync()
    .then(result => {
        return UserModel.findByPk(1)
    })
    .then(user => {
        if (!user) {
            return UserModel.create({ name: 'Pranjali', email: 'test@tes.com' })

        }
        return user
    })
    .then(user => {
        return user.createCart()
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(error => console.error(error))

