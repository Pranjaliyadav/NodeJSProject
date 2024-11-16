const mongoDB = require('mongodb')
const getDb = require('../util/database').getDb

class Product {
  constructor(title, price, description, imageUrl,id) {
    this.title = title
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id =id ? new mongoDB.ObjectId(id) : null;
  }

  save() {
    const db = getDb()
    let savedData
    if(this._id){
      //update product
      savedData =  db.collection('products')
      .updateOne({_id :new mongoDB.ObjectId(this._id)},{$set : this})
      .then(result => {
        console.log(result, "result 1" )
      })
      .catch(err => {
        console.log(err)
      })
    }
    else{
      savedData =  db.collection('products')
      .insertOne(this)
      .then(result => {
        console.log(result, "result 2" )
      })
      .catch(err => {
        console.log(err)
      })
    }
    return savedData
   
    //give collection name, if it doesnt exists it will get created on its own
    
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

  static async deleteById(prodId){
    const db = getDb()

   try{
    const response = await db.collection('products').deleteOne({_id : new mongoDB.ObjectId(prodId)})
    console.log(response,"deleted response")
    return response
   }
   catch(err) {
    console.log("error deleting", err)
   }
  }

}
module.exports = Product