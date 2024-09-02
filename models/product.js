const fs = require('fs');
const path = require('path');
const CartClass = require('../models/cart')
const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {

    getProductsFromFile(products => {
      if (this.id) {
        //update existing one
        const existingProdIndex = products.findIndex(p => p.id === this.id)
        const updatedProductArray = [...products]
        updatedProductArray[existingProdIndex] = this
        fs.writeFile(p, JSON.stringify(updatedProductArray), err => {
          console.log(err);
        });
        return
      }
      this.id = Math.random().toString();
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static deleteById(id) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id)
      const updatedProductArray = products.filter(p => p.id !== id)
      fs.writeFile(p, JSON.stringify(updatedProductArray), err => {
        if(!err){
          //remove from cart as well if prod doesnt exists
          CartClass.deleteProduct(id, product.price)
        }
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
};
