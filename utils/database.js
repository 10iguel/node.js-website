// const mongodb = require('mongodb')
//
// const MongoClient = mongodb.MongoClient
//
// let _db
//
// const mongoConnect = callback=>{
//     MongoClient.connect('mongodb+srv://10iguel:Carlczerny10@justdo.0xaby.mongodb.net/<dbname>?retryWrites=true&w=majority')
//         .then(client=> {
//             console.log('Connected!!!')
//             _db = client.db()
//             callback()
//             }
//         )
//         .catch(error=> {
//             console.log(error)
//             throw error
//         })
// }
//
// const getDb = ()=>{
//     if (_db){
//         return _db
//     }
//     throw 'No database found!'
// }
//
// exports.mongoConnect = mongoConnect
// exports.getDb = getDb
const MONGO_URI = 'mongodb+srv://10iguel:Carlczerny10@justdo.0xaby.mongodb.net/shop\n'

const mongoose = require('mongoose')

const connectDB = async (req,res,next)=>{
    const  conn = await mongoose.connect(MONGO_URI,{
        useNewUrlParser : true,
        useUnifiedTopology :true,
        useCreateIndex : true,
        useFindAndModify : false
    })
}

module.exports = connectDB
