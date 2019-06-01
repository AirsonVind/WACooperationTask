const bodyParser = require('body-parser');
const mongo = require('./mongo');
const jsonParser = bodyParser.json();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/test';
const ase = require('./ase');

let router = (server) =>{
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) =>{
        if(err){
            console.log(err);
        }else{
            console.log('connected!');
        }
        let db = client.db('mydb');
        server.post('/user/reg',jsonParser,(req,res) => {
            let body = req.body;
            mongo.find_one(db,'users',{"username":body.username},(err) => {
                res.json({
                    "code": -1,
                    "msg": err
                })
            },(result) => {
                if (result === null){
                    mongo.insert_many(db,'users',[body], (err) => {
                        res.json({
                            "code": -1,
                            "msg": err
                        })
                    },(result) => {
                        res.json({"code": 1,
                            "msg": 1})
                    })
                }else {
                    res.json({
                        "code": -1,
                        "msg": "账号已存在"
                    })
                }
            })
        })
        server.post('/user/login',jsonParser,function (req,res) {
            let body = req.body;
            mongo.find_one(db,'users',{"username":body.username},(err) => {
                res.json({
                    "code": -1,
                    "msg": err
                })
            },(result) => {
                if (result != null){
                    if (body.password === result.password){
                        res.json({
                            "code": 1,
                            "msg": "token XXXXXXXXX"
                        })
                    }else {
                        res.json({
                            "code": -1,
                            "msg": "密码错误"
                        })
                    }
                }else {
                    res.json({
                        "code": -1,
                        "msg": "用户不存在"
                    })
                }
            })
        })
    })

}




module.exports = router;