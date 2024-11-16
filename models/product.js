const { title } = require('process');

const getDb = require('../util/database').getDb

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb()
    //give collection name, if it doesnt exists it will get created on its own
    return db.collection('products')
      .insertOne(this)
      .then(result => {
        console.log(result, "result")
      })
      .catch(err => {
        console.log(err)
      })
  }

  static fetchAll() {
    const db = getDb()
    return db.collection('products').find().toArray()
      .then(products => {
        console.log("products", products)
      })
      .catch(err => {
        console.log("err", err)
      })
    //if filteFring
    // return db.collection('products').find({title : 'jhdskx'})
  }

}
module.exports = Product