const mongoose = require('mongoose')
const Schema = mongoose.Schema


//way to create schema in mongodb
const ordersSchema = new Schema({
    products : [{
        product : {type : Object, required : true},
        quantity : {type : Number, required : true}
    }],
    user : {
        email : {
            type : String,
            required : true
        },
        userId : {
            type : Schema.Types.ObjectId,
            required : true,
            ref : 'User'
        }
    }
})

//model name
module.exports = mongoose.model('Order', ordersSchema)