const mongoose  = require('mongoose')

const Schema = mongoose.Schema

//this is how you define a schema in mongoose
const productSchema = new Schema({
  
  title : {
    required : true,
    type : String
  },
  price : {
    required : true,
    type : Number
  },
  description : {
    required : true,
    type : String
  },
  imageUrl : {
    required : true,
    type : String
  },
  //creating relation bw users and product
  userId : {
    type : Schema.Types.ObjectId,
    //reference of other collection
    ref : 'User',
    required : true
  }

})

//this name will reflect as db name and the schema for it
//mongoose will make Product lowercase, add s to make it plural for collection name - products
module.exports = mongoose.model('Product', productSchema)


// class Product {

//   constructor(title, price, description, imageUrl,id) {
//     this.title = title
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id =id ? new mongoDB.ObjectId(id) : null;
//   }

//   save() {
//     const db = getDb()
//     let savedData
//     if(this._id){
//       //update product
//       savedData =  db.collection('products')
//       .updateOne({_id :new mongoDB.ObjectId(this._id)},{$set : this})
//       .then(result => {
//         console.log(result, "result 1" )
//       })
//       .catch(err => {
//         console.log(err)
//       })
//     }
//     else{
//       savedData =  db.collection('products')
//       .insertOne(this)
//       .then(result => {
//         console.log(result, "result 2" )
//       })
//       .catch(err => {
//         console.log(err)
//       })
//     }
//     return savedData
   
//     //give collection name, if it doesnt exists it will get created on its own
    
//   }
//   static async fetchAll() {
//     const db = getDb();
//     try {
//       const allProducts = await db.collection('products').find().toArray();
//       console.log("products", allProducts);
//       return allProducts;
//       //if filteFring
//       // return db.collection('products').find({title : 'jhdskx'})
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       throw err; // Propagate the error to the caller
//     }
//   }

//   static async findById(prodId){
//     const db = getDb()
//     try{
//       const response = await db.collection('products').find({_id :new mongoDB.ObjectId(prodId)}).next()
//       console.log("product by id", response)
//       return response

//     }
//     catch(err){
//       console.log(err,"error finding product by id")
//     }
//   }

//   static async deleteById(prodId){
//     const db = getDb()

//    try{
//     const response = await db.collection('products').deleteOne({_id : new mongoDB.ObjectId(prodId)})
//     console.log(response,"deleted response")
//     return response
//    }
//    catch(err) {
//     console.log("error deleting", err)
//    }
//   }

// }
// module.exports = Product