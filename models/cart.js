const fs = require('fs')
const path = require('path')
const rootDir = require('../util/path')

const p = path.join(
    rootDir,
    'data',
    'cart.json'
)


module.exports = class Cart {
    static addProduct(id, productPrice) {
        //fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 }
            if (!err) {
                cart = JSON.parse(fileContent)
            }
            //analyze the cart => find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id)
            const existingProduct = cart.products[existingProductIndex]
            let updatedProduct
            //add new product/ incr quantity

            if (existingProduct) {
                updatedProduct = { ...existingProduct }
                updatedProduct.qty = updatedProduct.qty + 1
                cart.products = [...cart.products]
                cart.products[existingProductIndex] = updatedProduct
            }

            else {
                updatedProduct = { id: id, qty: 1 }
                cart.products = [...cart.products, updatedProduct]
            }

            cart.totalPrice = cart.totalPrice + +productPrice
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log("here error adding in cart", err)
            })
        })



    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return
            }
            let cart = JSON.parse(fileContent)
            const updatedContent = { ...cart }
            console.log("here find", JSON.parse(fileContent), cart, id)
            const product = updatedContent.products.find(prod => prod.id === id)
            if (product) {

                updatedContent.products = updatedContent.products.filter(p => p.id !== id)
                console.log("here parse pod", product, id)
                cart.totalPrice -= product.qty * productPrice
                fs.writeFile(p, JSON.stringify(cart), err => {
                    console.log(err);
                });
            }
        })
    }

}