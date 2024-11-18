const Product = require('../models/product');

const Order = require('../models/order');
exports.getProducts = (req, res, next) => {
  //sequelize method to fetch data
  Product.find()
    .then(result => {
      console.log("here get prod shop", result)
      res.render('shop/product-list', {
        prods: result,
        pageTitle: 'All Products',
        path: '/products'
      });
    }).catch(err => console.err(err))
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  //this findById is a mongoose fn, it ill automatically convert your string to objectId string for checking
  Product.findById(prodId).then(
    (rows) => {
      console.log("here gett", prodId, rows)
      res.render('shop/product-detail', {
        product: rows,
        pageTitle: rows?.title,
        path: '/products'
      });
    }
  ).catch(error => console.log(error));
};

exports.getIndex = (req, res, next) => {

  //sequelize method to fetch data
  Product.find()
    .then(result => {
      console.log("produc res", result)
      res.render('shop/index', {
        prods: result,
        pageTitle: 'Shop',
        path: '/'
      });
    }).catch(err => console.err(err))
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')

    .then(cartProducts => {
      console.log("here cart", cartProducts, cartProducts.cart.items)

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts.cart.items
      });
    })
    .catch(err => console.log(err))

};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId)
    .then(product => {
      console.log("here request", req.user)
      return req.user.addToCart(product)
    })
    .then(result => {
      console.log("after adding", result)
      res.redirect('/cart')
    })
    .catch(err => {
      console.log("error adding in cart", err)
    })
}

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId' : req.user._id})
    .then(orders => {
      console.log("here ")
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });

    })
    .catch(err => console.log(err))
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });


};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  req.user.deleteFromCart(prodId)

    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))

}

exports.postOrder = (req, res, next) => {

  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(i => {
        //with this ._doc, we get all related record data as well for that id from relatons. metadata
        return { quantity: i.quantity, product: { ...i.productId._doc } }
      })
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products

      })
      return order.save()
    })

    .then(
      (result) => {
        return req.user.clearCart()
      
      }
    )
    .then(
      (result) => {
      
        res.redirect('/orders')
      }
    )
    .catch(err => console.log(err))
}