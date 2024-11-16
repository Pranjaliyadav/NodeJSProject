const mongoDB = require('mongodb')
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
  static async fetchAll() {
    const db = getDb();
    try {
      const allProducts = await db.collection('products').find().toArray();
      console.log("products", allProducts);
      return allProducts;
      //if filteFring
      // return db.collection('products').find({title : 'jhdskx'})
    } catch (err) {
      console.error("Error fetching products:", err);
      throw err; // Propagate the error to the caller
    }
  }

  static async findById(prodId){
    const db = getDb()
    try{
      const response = await db.collection('products').find({_id :new mongoDB.ObjectId(prodId)}).next()
      console.log("product by id", response)
      return response

    }
    catch(err){
      console.log(err,"error finding product by id")
    }
  }

}
module.exports = Product