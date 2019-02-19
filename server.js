var http = require('http');
var interval,
    timeout;

const server = http.createServer(()=>{
    console.log('http server running');
     interval = 2000;
     timeout = 10000;
}).listen(3000);

server.on('request',(req,res)=>{
    const consoleTime = setInterval(()=>{console.log(getTime());},interval);
    const resTime = setTimeout(()=>{
        res.end(`${getTime()}`);
        clearInterval(consoleTime);
    },timeout);
});



function getTime(){
    let date = new Date(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        second = date.getSeconds(),
        day = date.getDate(), 
        month = date.getMonth(), 
        year = date.getFullYear(),
        dateNow = `${hours}:${minutes}:${second}  ${day}.0${month}.${year}`; 
    return dateNow;
}