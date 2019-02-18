var http = require('http');

http.createServer(function(res,req){
    console.log('HTTP server running');
    res.writeHead(200,{
        'Content-Type':'text/html'});
}).listen(3000);