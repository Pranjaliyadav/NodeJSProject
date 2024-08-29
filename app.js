const http = require('http')



const server = http.createServer((req, res) => {
    console.log("here req", req.url, req.method, req.headers)
    // process.exit()

    //we are sending all this back to client
    res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write('<body><h1>Hello</h1></body>')
    res.write('</html>')
    res.end()

}) //this returns a server

server.listen(3000)