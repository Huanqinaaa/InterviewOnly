var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

function getInfo(callback){
    fs.readFile('./stock.json','utf8',function (err,data){
        var stocks = [];
        if(err){
            callback(stocks);
        }else{
            if(data.startsWith('[')){
                stocks = JSON.parse(data);
            }
            callback(stocks);
        }
    });
}
function setInfo(data,callback){
    fs.writeFile('./stock.json',JSON.stringify(data),callback);
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'/')));
app.get('/',function (req,res){
    fs.createReadStream('./index.html').pipe(res); 
});
app.get('/stock',function (req,res){// list
    getInfo(function (data){
        res.send(data);
    });
});
app.get('/stock/:id',function (req,res){// detail
    var id= req.params.id;
    getInfo(function (data){
        var stock = data.find(function (item){
            return item.id == id;
        });
        setInfo(data,function (){
            res.send(stock);
        })
    })
});
app.post('/stock',function (req,res){ // add
    var stock = req.body;
    getInfo(function (data){
        stock.id = data.length ? data[data.length - 1].id + 1 : 1;
        data.push(stock);
        setInfo(data,function (){
            res.send(stock);
        })
    })
});
app.listen(8004,function(){
    console.log("http://localhost:8004");
});