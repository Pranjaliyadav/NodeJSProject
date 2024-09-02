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
        // Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex(
                prod => prod.id === id
            );
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            // Add new product/ increase quantity
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
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
                cart.products = updatedContent.products
                cart.totalPrice -= product.qty * productPrice
                fs.writeFile(p, JSON.stringify(cart), err => {
                    console.log(err);
                });
                console.log("here parse pod", cart)
            }
            return
        })
    }

    static getCartProducts(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                // If the file is not found or there is any error, return null

                cb(null);
            } else {
                try {
                    const cart = JSON.parse(fileContent);
                    // If the cart is empty or doesn't contain any data, return null
                    if (Object.keys(cart).length === 0) {
                        cb(null);
                    } else {
                        cb(cart);
                    }
                } catch (parseErr) {
                    // If there is a parsing error (e.g., invalid JSON), return null

                    cb(null);
                }
            }
        });
    }


}