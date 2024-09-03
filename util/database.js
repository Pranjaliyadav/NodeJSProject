const mysql = require('mysql2')

//pool of connection, each query needs a connection
const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    database : 'node-complete',
    password : 'password'

})

module.exports = pool.promise()