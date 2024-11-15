const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db

const mongoConnect = (callback) => {
    //this shop? is the db name, i its not present, it will be created on its own
  const uri = 'mongodb+srv://yadavpranjali1223:xfhsWKnmLqenYFRX@cluster0.epngj.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0';

  MongoClient.connect(uri, {
    tls: true,
    tlsAllowInvalidCertificates: true, // Only for development
  })
    .then((client) => {
      console.log('Connected to MongoDB');
      _db = client.db()
    //   _db = client.db('test') //can give db name here as well
      callback();
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err.message);
      throw err
    });
};

const getDb = ( )=>{
    if(_db){
        return _db
    }
    throw 'No database found!'
}


exports.mongoConnect = mongoConnect
exports.getDb = getDb
