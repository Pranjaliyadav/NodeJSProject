
const mongoDB = require('mongodb')
const Product = require('../models/product');
const product = require('../models/product');
const {validationResult} = require('express-validator');
const { default: mongoose } = require('mongoose');
exports.getAddProduct = (req, res, next) => {

  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated : req.session.isLoggedIn,
    hasError : false,
    errorMessage : null,
    validationErrors : []
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  let image= req.file
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req)
  
  if(!req?.file){
    console.log("here file", req?.file)
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      product: {
        title, price, description
      },
      hasError : true,
      isAuthenticated : req.session.isLoggedIn,
      errorMessage : 'Attached file is not an image',
      validationErrors: []
    })
  } 

if(!errors.isEmpty()){
 return res.status(422).render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    product: {
      title, image, price, description
    },
    hasError : true,
    isAuthenticated : req.session.isLoggedIn,
    errorMessage : errors.array()[0].msg,
    validationErrors: errors.array()
  })
}

const imageUrl = image.path
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId : req.user
    //even if u pas whole user, mongoose will pick id only, which can be used as a reference to actual data, like postgres
  })
  //.save() is coming from mongoose 
  product.save()
    .then(
      result => {
        console.log("post add", result)
        res.redirect('/admin/products')
      }
    )
    .catch(err=> {
      console.log("here error", err)
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
};

exports.getEditProduct = (req, res, next) => {

  const editMode = req.query.edit
  console.log("here editMode", editMode)
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId
  Product.findById(prodId)
    // Product.findByPk(prodId)
    .then(prod => {
      const prodFound = prod
      if (!prodFound) {
        return res.redirect('/')
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: prodFound,
        isAuthenticated : req.session.isLoggedIn,
        hasError : false,
        errorMessage : null,
        validationErrors : []
      })
    })
    .catch(err=> {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updatedDescription = req.body.description
  const image = req.file
  const errors = validationResult(req)
  if(!errors.isEmpty()){
   return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product: {
        title : updatedTitle,price: updatedPrice, description : updatedDescription,
         _id : prodId
      },
      hasError : true,
      isAuthenticated : req.session.isLoggedIn,
      errorMessage : errors.array()[0].msg,
      validationErrors: errors.array(),
     
    })
  }
  Product.findById(prodId)
    .then(result => {
      console.log("here id displ",result.userId, req.user._id)
      if(result.userId.toString() !== req.user._id.toString()){
        return res.redirect('/')
      }
      result.title = updatedTitle
      result.price = updatedPrice
      result.description = updatedDescription
      if(image){
        //if new file is uploaded then save it. otherwise dont
        result.imageUrl = image.path
      }

      return result.save().then(result => {
        console.log("updated product")
        res.redirect('/admin/products')
      })
    })
    
    .catch(err=> {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })

}

exports.getProducts = (req, res, next) => {
  Product.find({userId : req.user._id})
    .then(result => {
      console.log("here getproduc", result)
      res.render('admin/products', {
        prods: result,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated : req.session.isLoggedIn
      });
    }) .catch(err=> {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.deleteOne({_id : productId, userId : req.user._id})

    .then(result => {
      console.log('deleted product')
      res.redirect('/admin/products')

    })
    .catch(err=> {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}
