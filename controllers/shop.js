const Product = require('../models/product');
const CartModel = require('../models/cart');
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product?.title,
      path: '/products'
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  debugger
  CartModel.getCartProducts(cart => {
    const cartProducts = []
    console.log("heer 1")
    Product.fetchAll(products => {
      for (const prod of products) {
        if (cart && cart.products) {

          const cartProdData = cart.products.find(p => p.id === prod.id)
          if (cartProdData) {
            cartProducts.push({ productData: prod, qty: cartProdData.qty })
            console.log("heer 2", cartProducts)

          }
        }
        else {
          return
        }
      }
      console.log("here yes 222", cartProducts)
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    })
  })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId, (product) => {
    CartModel.addProduct(prodId, product.price)
  })
  console.log("here productId", prodId)
  res.redirect('/cart')
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
