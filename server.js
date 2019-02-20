require('dotenv').config();

var http = require('http');
var interval = process.env.INTERVAL;
var timeout = process.env.TIMEOUT;

console.log('interval ',interval);
console.log('timeout ',timeout);
const server = http.createServer().listen(3000,()=>{
    console.log('Сервер запущено на порті 3000 ')
});


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