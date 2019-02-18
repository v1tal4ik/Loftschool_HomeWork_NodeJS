var http = require('http');

const server = http.createServer(()=>{
    console.log('http server running');
}).listen(3000);

server.on('request',(req,res)=>{
    const consoleTime = setInterval(()=>{console.log(getTime());},2000);
    const resTime = setTimeout(()=>{
        res.end(`${getTime()}`);
        clearInterval(consoleTime);
    },10000);
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