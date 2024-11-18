const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema =new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    cart : {
        items : [
            {
             productId : {type : Schema.Types.ObjectId, ref : 'Product',required : true},
             quantity : {type : Number, required : true}
            }]
    },
})

//add additonal method
userSchema.methods.addToCart = async function(product) {
    let cartProductFoundIndex = this.cart?.items?.findIndex(
                    cp => 
                  cp.productId.toString() === product._id.toString()
                    
                ) 
                
            
                let newQty = 1
                const updatedCartItems = this.cart?.items ? [...this.cart?.items] : []
        
                if (cartProductFoundIndex >= 0) {
                    newQty = this.cart.items[cartProductFoundIndex].quantity + 1
                    updatedCartItems[cartProductFoundIndex].quantity = newQty
                }
                else {
                    updatedCartItems.push({
                        productId: product._id,
                        quantity: newQty
                    })
                }
                const updatedCart = { items: updatedCartItems }
                this.cart = updatedCart
               return this.save()
        
}

userSchema.methods.deleteFromCart =  function (productId) {
    const updatedCartItem = this.cart.items.filter(rec => rec.productId.toString() !== productId.toString())
    this.cart.items = updatedCartItem
    return this.save()
}
//collection name - users
module.exports = mongoose.model('User', userSchema)


// const { getDb } = require('../util/database')
// const mongoDb = require('mongodb')


// class User {
//     constructor(username, email, cart, id) {
//         this.name = username
//         this.email = email
//         this.cart = cart // {items  : []}
//         this._id = id
//     }

//     save() {
//         const db = getDb()
//         try {
//             const response = db.collection('users')
//                 .insertOne(this)
//             console.log("saved user", response)
//             return response
//         }
//         catch (err) {
//             console.log("error saving user", err)
//         }
//     }

//     async addToCart(product) {
//         let cartProductFoundIndex = this.cart?.items?.findIndex(
//             cp => 
//                 cp.productId.toString() === product._id.toString()
            
//         ) 
        
    
//         let newQty = 1
//         const updatedCartItems = this.cart?.items ? [...this.cart?.items] : []

//         if (cartProductFoundIndex >= 0) {
//             newQty = this.cart.items[cartProductFoundIndex].quantity + 1
//             updatedCartItems[cartProductFoundIndex].quantity = newQty
//         }
//         else {
//             updatedCartItems.push({
//                 productId: new mongoDb.ObjectId(product._id),
//                 quantity: newQty
//             })
//         }
//         const updatedCart = { items: updatedCartItems }

//         const db = getDb()
//         try {
//             const response = await db.collection('users')
//                 .updateOne(
//                     { _id: new mongoDb.ObjectId(this._id) },
//                     { $set: { cart: updatedCart } })
//             return response
//         }
//         catch (err) {
//             console.log("error updating cart", err)
//         }


//     }

//     async getCart() {
//         const db = getDb()
//         try {
//             const productIds = this.cart.items.map(rec => rec.productId)

//             const cartItems = await db.collection('products').find({ _id: { $in: productIds } })
//                 .toArray()
//             if (cartItems) {
//                 return cartItems.map(p => {
//                     return {
//                         ...p, quantity: this.cart.items.find(i => {
//                             return i.productId.toString() === p._id.toString()
//                         }).quantity,
//                         userId : this._id
//                     }
//                 })
//             }
//             else {
//                 return []
//             }

//         }
//         catch (err) {
//             console.log("error getting cart", err)
//         }


//     }

//     async deleteFromCart(productId) {
//         const db = getDb()
//         const updatedCartItem = this.cart.items.filter(rec => rec.productId.toString() !== productId.toString())

//         return await db.collection('users')
//             .updateOne(
//                 { _id: new mongoDb.ObjectId(this._id) },
//                 { $set: { cart: { items: updatedCartItem } } })

//     }
//     async addOrder() {
//         const db = getDb()
//        return await this.getCart()
//             .then(async products => {

//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new mongoDb.ObjectId(this._id),
//                         email: this.email,
//                         name: this.name
//                     }
//                 }
//                 try {
//                     const response = await db.collection('orders')
//                         .insertOne(order)

//                     if (response) {
//                         this.cart = { items: [] }
//                         try {
//                             const response = db.collection('users')
//                                 .updateOne(
//                                     { _id: new mongoDb.ObjectId(this._id) },
//                                     { $set: { cart: { items: [] } } }
//                                 )

//                             return response
//                         }
//                         catch (err) {
//                             console.log("error updating cart", err)
//                         }
//                     }
//                 }
//                 catch (err) {
//                     console.log("error adding cart to order", err)
//                 }
//             })

//     }

//     async getOrdersForUser() {
//         const db = getDb()
//         try{
//             const response = await db.collection('orders')
//             .find({'user._id' : new mongoDb.ObjectId(this._id)})
//             .toArray()
//             return response
//         }
//         catch(err){
//             console.log("error getting order",err)
//         }
//     }

//     // async deleteQuantityFromCart(productId) {
//     //     const db = getDB()
//     //     const updatedCartItem = this.cart.items.findOne(rec => rec.productId.toString() === productId.toString())
//     //     let cartToSave = []
//     //     if (updatedCartItem) {
//     //         let currQty = updatedCartItem.quantity
//     //         currQty--
//     //         if (currQty > 0) {

//     //         }
//     //         else {
//     //             cartToSave = this.cart.items.filter(rec => rec.productId.toString() !== productId.toString())

//     //         }

//     //         try {

//     //         }
//     //         catch (err) {
//     //             console.log("error deleting cart item", err)
//     //         }

//     //     }
//     // }
//     static async findById(userId) {
//         const db = getDb()
//         try {
//             const response = await db.collection('users')
//                 .findOne({ _id: new mongoDb.ObjectId(userId) })
//             console.log("saved user", response)
//             return response
//         }
//         catch (err) {
//             console.log("error finding user", err)
//         }
//     }
// }


// module.exports = User

// //id, name, email