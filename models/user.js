const { getDb } = require('../util/database')
const mongoDb = require('mongodb')


class User {
    constructor(username, email) {
        this.name = username
        this.email = email
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