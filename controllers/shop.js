const Product = require('../models/product');
const fs = require('fs')
require('dotenv').config();
const Order = require('../models/order');
const path = require('path')
const PDFDocument = require('pdfkit') //pdf generation 
const ITEMS_PER_PAGE = 1
const stripe = require('stripe')(process.env.STRIPE_KEY) //for payments

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1
let totalProducts

Product.find().countDocuments().then(
  products =>{
    totalProducts = products
    return Product.find()
    .skip((page - 1)* ITEMS_PER_PAGE ) //skip first x amount of records
    .limit(ITEMS_PER_PAGE) //limit amnt of data we fetch 
  }
)

  .then(result => {
      console.log("produc res", result)
      res.render('shop/product-list', {
        prods: result,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
        totalProducts,
        currentPage : page,
        hasNextPage : ITEMS_PER_PAGE * page < totalProducts,
        hasPreviousPage : page > 1,
        nextPage : page + 1,
        previousPage : page - 1,
        lastPage : Math.ceil(totalProducts/ ITEMS_PER_PAGE)
      });
    }) 
  .catch(err=> {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
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
        path: '/products', isAuthenticated: req.session.isLoggedIn
      });
    }
  ) .catch(err=> {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1
let totalProducts

Product.find().countDocuments().then(
  products =>{
    totalProducts = products
    return Product.find()
    .skip((page - 1)* ITEMS_PER_PAGE ) //skip first x amount of records
    .limit(ITEMS_PER_PAGE) //limit amnt of data we fetch 
  }
)

  .then(result => {
      console.log("produc res", result)
      res.render('shop/index', {
        prods: result,
        pageTitle: 'Shop',
        path: '/', 
        isAuthenticated: req.session.isLoggedIn,
        totalProducts,
        currentPage : page,
        hasNextPage : ITEMS_PER_PAGE * page < totalProducts,
        hasPreviousPage : page > 1,
        nextPage : page + 1,
        previousPage : page - 1,
        lastPage : Math.ceil(totalProducts/ ITEMS_PER_PAGE)
      });
    }) .catch(err=> {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')

    .then(cartProducts => {
      console.log("here cart", cartProducts, cartProducts.cart.items)

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts.cart.items, isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err=> {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })

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
    .catch(err=> {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      console.log("here ")
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });

    })
    .catch(err=> {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
};

exports.getCheckout = (req, res, next) => {
  let products = null
  let total = 0
  req.user
    .populate('cart.items.productId')

    .then(cartProducts => {
      products = cartProducts.cart.items
      
      products.forEach(p => {
        total += p.quantity * p.productId.price
      })
      const lineItems = products.map(p => {
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: p.productId.title,
              description: p.productId.description,
            },
            unit_amount: p.productId.price * 100, // Stripe expects the amount in cents
          },
          quantity: p.quantity,
        };
      });


      //create session
      return stripe.checkout.sessions.create({
        payment_method_types : ['card'],
        line_items : lineItems,
        mode: 'payment',
        success_url : req.protocol + '://' + req.get('host') + '/checkout/success', //like http://localhost:3000/checkout/success
        cancel_url : req.protocol + '://' + req.get('host') + '/checkout/cancel',
      })

    
    })
    .then(result =>{
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products,
         isAuthenticated: req.session.isLoggedIn,
         totalSum : total,
         sessionId : result.id
      });
    })
    .catch(err=> {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })


};
exports.getCheckoutSuccess = (req, res, next) => {

    req.user
      .populate('cart.items.productId')
      .then(user => {
        const products = user.cart.items.map(i => {
          //with this ._doc, we get all related record data as well for that id from relatons. metadata
          return { quantity: i.quantity, product: { ...i.productId._doc } }
        })
        const order = new Order({
          user: {
            email: req.user.email,
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
      .catch(err=> {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  

};
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  req.user.deleteFromCart(prodId)

    .then(result => {
      res.redirect('/cart')
    })
    .catch(err=> {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })

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
          email: req.user.email,
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
    .catch(err=> {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getInvoice = async (req, res, next) =>{
  const orderId = req.params.orderId
  let orders = null
   await Order.findById(orderId)
  .then(orderFound => {
    orders = orderFound
    console.log("here order", orders)
    if(!orderFound){
      return next(new Error('No order found!'))
    }
    if(orderFound.user.userId.toString() !== req.user._id.toString()){
      return next(new Error('Unauthorized'))
    }
  })
  .catch(err => next(err))
  if(orders){

  }
  const invoiceName = 'invoice-' + orderId + '.pdf'
  const invoicePath = path.join('data', 'invoices',invoiceName)
const pdfDoc = new PDFDocument()
res.setHeader('Content-Type' , 'application/pdf' )
res.setHeader('Content-Disposition','inline; filename="' + invoiceName + '"' ) //lets you download file as pdf

pdfDoc.pipe(fs.createWriteStream(invoicePath)) //creating writabe stream
pdfDoc.pipe(res) //creating path and headers
pdfDoc.fontSize(26).text('Invoice',
  {
    underline : true
  }
)
pdfDoc.text('--------------------------------')
let totalPrice = 0
orders.products.forEach(element => {
  totalPrice += (element.quantity*element.product.price)
  pdfDoc
  .fontSize(14)
  .text(
    element.product.title + 
    ' - ' + 
    element.quantity + 
    ' x ' + 
    'Rs ' + 
    element.product.price
  )
});
pdfDoc.text('--------------------------------')

pdfDoc.text('Total Price: Rs ' + totalPrice)
pdfDoc.end() //telling to stop writing


}