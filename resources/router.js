let bodyParser = require('body-parser');
let mongo = require('');
let jsonParser = bodyParser.json();

let register = function(server){
    server.post('/user/reg',jsonParser,function (req,res) {
        let body = req.body;
        if (!mongo.find('user',body.username)){
            mongo.insert('user',body.username);
            res.status(200).json(
                {
                    "code": 1,
                    "msg": "token XXXXXXXXX"
                }
            );
        } else {
            res.status().json(
                {
                    "code": -1,
                    "msg": "失败原因"
                }
            );
        }
    })
}

let login = function(server){
    server.post('/user/login',jsonParser,function (req,res) {
        let body = req.body;
        if (mongo.find('user',body.username)){
            res.status(200).json(
                {
                    "code": 1,
                    "msg": 1
                }
            );
        } else {
            res.status().json(
                {
                    "code": -1,
                    "msg": "失败原因"
                }
            );
        }
    })
}

let info_search = function(server){
    server.get('/user/info/:username',function (req,res) {
        let username = req.params.username;

    })
}


module.exports = {register,login,info_search};