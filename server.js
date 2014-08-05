var ejs = require('ejs');
var express = require('express');
var app = express();

app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

var router = require(__dirname+'/index.js');
console.log('router', router);

app.use('/', router);

app.listen(5656);
console.log('listening on port 5656');

