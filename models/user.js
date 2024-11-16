const { getDb } = require('../util/database')
const mongoDb = require('mongodb')


class User {
    constructor(username, email, cart, id) {
        this.name = username
        this.email = email
        this.cart = cart // {items  : []}
        this._id = id
    }

    save() {
        const db = getDb()
        try {
            const response = db.collection('users')
                .insertOne(this)
            console.log("saved user", response)
            return response
        }
        catch (err) {
            console.log("error saving user", err)
        }
    }

    async addToCart(product) {
        // const cartProuctFound = this.cart.items.findIndex(
        //     cp =>{
        //         return cp._id === product._id
        //     }
        // )
        const updatedCart = { items: [{productId : new mongoDb.ObjectId(product._id), quantity: 1 }] }
        const db = getDb()
        try {
            const response = await db.collection('users')
                .updateOne(
                    { _id: new mongoDb.ObjectId(this._id) },
                    { $set: { cart: updatedCart } })
            return response
        }
        catch (err) {
            console.log("error updating cart", err)
        }


    }

    static async findById(userId) {
        const db = getDb()
        try {
            const response = await db.collection('users')
                .findOne({ _id: new mongoDb.ObjectId(userId) })
            console.log("saved user", response)
            return response
        }
        catch (err) {
            console.log("error finding user", err)
        }
    }
}


module.exports = User

//id, name, email