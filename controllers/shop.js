const Product = require('../models/product');

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
  req.user.getCart()
    .then(cartProducts => {
      console.log("here cart", cartProducts)

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
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
  req.user
    .getOrdersForUser()
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
    .addOrder()

    .then(
      (result) => {

        res.redirect('/orders')
      }
    )
    .catch(err => console.log(err))
}