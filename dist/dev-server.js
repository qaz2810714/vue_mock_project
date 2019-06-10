//引入依赖，express是node上的一个web框架
var express = require('express');
 
var path = require('path');
var app = express();

app.use('/static',express.static(__dirname + '/static'));
 

app.get('/check.txt', (req, res) => {
    return res.json({status:'success'})
})

app.get('/env.js', (req, res) => {
  console.log("node.js服务器环境变量:" + process.env.CONFIGENV);
  return res.json({env:process.env.CONFIGENV});
})

app.get('/index.html', function (req, res) {    
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/', function (req, res) {    
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(3000, function () {
    console.log("开始监听");
});