const { error } = require('console');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description

  }).then(
    result => {
      console.log(result)
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
  Product.findById(prodId, prodFound => {
    if (!prodFound) {
      return res.redirect('/')
    }

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: prodFound
    })
  })
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updatedImageUrl = req.body.imageUrl
  const updatedDescription = req.body.description
  const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice)
  updatedProduct.save()
  res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {

  Product.findAll().then(result => {
    res.render('admin/products', {
      prods: result,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => console.error(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.deleteById(productId)
  res.redirect('/admin/products')
}