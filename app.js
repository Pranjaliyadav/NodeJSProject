
const express = require('express')

const app = express() 

//allows us to use multiple middleware function
app.use((req, res, next)=>{
    console.log("In the middleware")
    next() //to go to next middleware fn in line
})

app.use((req, res, next) => {
    console.log("In the another middleware")
    res.send("<h1>Hello another</h1>")
})

app.listen(3000) 