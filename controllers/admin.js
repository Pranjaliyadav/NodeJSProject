const { error } = require('console');
const mongoDB = require('mongodb')
const Product = require('../models/product');
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated : req.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

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
    .catch(error => {
      console.error(error)
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
        isAuthenticated : req.isLoggedIn
      })
    })
    .catch(err => console.error(err))
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updatedImageUrl = req.body.imageUrl
  const updatedDescription = req.body.description

  Product.findById(prodId)
    .then(result => {

      result.title = updatedTitle
      result.price = updatedPrice
      result.description = updatedDescription
      result.imageUrl = updatedImageUrl

      return result.save()
    })
    .then(result => {
      console.log("updated product")
      res.redirect('/admin/products')
    })
    .catch(err => console.error(err))

}

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(result => {
      console.log("here getproduc", result)
      res.render('admin/products', {
        prods: result,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated : req.isLoggedIn
      });
    }).catch(err => console.error(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.findByIdAndDelete(productId)

    .then(result => {
      console.log('deleted product')
      res.redirect('/admin/products')

    })
    .catch(err => console.error(err)
    )
}
