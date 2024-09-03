const Product = require('../models/product');
const CartModel = require('../models/cart');
exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(
    ([rows, fieldData]) => {

      res.render('shop/product-list', {
        prods: rows,
        pageTitle: 'All Products',
        path: '/products'
      });
    }
  ).catch(error => console.error("Here error getting index", error));

};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then(
    ([rows]) => {
      res.render('shop/product-detail', {
        product: rows[0],
        pageTitle: rows[0]?.title,
        path: '/products'
      });
    }
  ).catch(error => console.log(error));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then(
    ([rows, fieldData]) => {

      res.render('shop/index', {
        prods: rows,
        pageTitle: 'Shop',
        path: '/'
      });
    }
  ).catch(error => console.error("Here error getting index", error));
};

exports.getCart = (req, res, next) => {
  debugger
  CartModel.getCartProducts(cart => {
    const cartProducts = []
    Product.fetchAll(products => {
      for (const prod of products) {
        if (cart && cart.products) {

          const cartProdData = cart.products.find(p => p.id === prod.id)
          if (cartProdData) {
            cartProducts.push({ productData: prod, qty: cartProdData.qty })


          }
        }
        else {
          return
        }
      }
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

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId

  Product.findById(prodId, product => {
    console.log("prodPricning", prodId, product)
    CartModel.deleteProduct(prodId, product.price)
    res.redirect('/cart')
  })
}