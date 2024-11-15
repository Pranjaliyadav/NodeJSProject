const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  const uri = 'mongodb+srv://yadavpranjali1223:xfhsWKnmLqenYFRX@cluster0.epngj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

  MongoClient.connect(uri, {
    tls: true,
    tlsAllowInvalidCertificates: true, // Only for development
  })
    .then((client) => {
      console.log('Connected to MongoDB');
      callback(client);
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err.message);
    });
};

module.exports = mongoConnect;
