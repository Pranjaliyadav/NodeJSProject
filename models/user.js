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
        const cartProductFoundIndex = this.cart?.items?.findIndex(
            cp =>{
                return cp.productId.toString() === product._id.toString()
            }
        ) || -1

        let newQty = 1
        const updatedCartItems = this.cart?.items ? [...this.cart?.items] : []

        if(cartProductFoundIndex >= 0){
            newQty = this.cart.items[cartProductFoundIndex].quantity + 1
            updatedCartItems[cartProductFoundIndex].quantity = newQty
        }
        else{
            updatedCartItems.push({
                productId : new mongoDb.ObjectId(product._id),
                quantity : newQty
            })
        }
        const updatedCart = { items:updatedCartItems }

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