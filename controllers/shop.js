const Product = require('../models/product');
const CartModel = require('../models/cart');
exports.getProducts = (req, res, next) => {
  //sequelize method to fetch data
  Product.findAll().then(result => {
    res.render('shop/product-list', {
      prods: result,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err => console.err(err))
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId).then(
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
  Product.findAll().then(result => {
    res.render('shop/index', {
      prods: result,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => console.err(err))
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(cart => {
      console.log("here cart", cart)
      return cart.getProducts().then(cartProducts => {
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: cartProducts
        });
      })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
  
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  let fetchedCart
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({ where: { id: prodId } })

    })
    .then(prodFound => {
      let product
      if (prodFound.length > 0) {
        product = prodFound[0]
      }
      let newQty = 1
      if (product) {
        //...
      }
      return Product.findByPk(prodId)
        .then(prod => {
          return fetchedCart.addProduct(prod, { through: { quantity: newQty } })
        })
        .then(added => {
          console.log("here added", added)
          res.redirect('/cart')

        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });


};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId

  Product.findById(prodId, product => {
    console.log("prodPricning", prodId, product)
    CartModel.deleteProduct(prodId, product.price)
    res.redirect('/cart')
  })
}