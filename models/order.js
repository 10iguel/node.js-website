const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    products : [
        {
            product : {type : Object , required : true},
            quantity : { type : Number , required : true}
        }
    ],
    user : {
        email : {
            type : String ,
            required : true
        },
        userId : {
            type : mongoose.Schema.ObjectId,
            required : true,
            ref : 'User'
        }
    }
})

module.exports = mongoose.model('Order',OrderSchema)
