

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

const isAuth = require('../middleware/is-auth')

const {check, body} = require('express-validator')


// /admin/add-product => GET
//now isAuth is visited before actual route, read left to right
router.get('/add-product',
    isAuth, adminController.getAddProduct);

// // /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',
    [
        body('title')
        .isString()
        .isLength({min:3})
        .trim(),
        body('price')
        .isFloat(),
        body('description')
        .isLength({min:5, max:200})
        .trim()

    ] ,isAuth,adminController.postAddProduct);

router.get('/edit-product/:productId',isAuth, adminController.getEditProduct)

router.post('/edit-product',
    [
        body('title')
        .isString()
        .isLength({min:3})
        .trim(),
        body('price')
        .isFloat(),
        body('description')
        .isLength({min:5, max:200})
        .trim()

    ], isAuth, adminController.postEditProduct)

router.post('/delete-product',isAuth, adminController.postDeleteProduct)

module.exports = router;
