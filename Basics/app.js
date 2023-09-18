const http = require('http')
const fs = require('fs') //helps us work with file system


const server =  http.createServer((req,res) =>{
    const url = req.url
    const method = req.method
   console.log(req)

    if(url === '/message' && method === 'POST'){
        const body = [];
        
        req.on("data", (chunk) => {
            console.log(chunk)
            body.push(chunk)
        })
        req.on('end', () => {
            const parseBody = Buffer.concat(body).toString()
            console.log(parseBody)
        })

       

    }

   
   
}) 
//event listener , we can exit this also when we want to

server.listen(3000)

