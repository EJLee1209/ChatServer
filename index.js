var express = require('express');
var app = express();
// var server = require('http').createServer(app);
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', require('./routes/rides'));

app.get('/', (req,res)=>{
    res.send('hello world');
})

app.listen(3000, function(){
    console.log("server on 3000")
});