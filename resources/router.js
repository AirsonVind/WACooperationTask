let bodyParser = require('body-parser');
let mongo = require('');
let jsonParser = bodyParser.json();

let register = function(server){
    server.post('/user/reg',jsonParser,function (req,res) {
        let body = req.body;
        while (1){

        }
    })
}

let login = function(server){
    server.post('/user/login',jsonParser,function (req,res) {
        let body = req.body;
        while (1){

        }
    })
}


module.exports = {register,login};