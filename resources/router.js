const bodyParser = require('body-parser');
const mongo = require('./mongo');
const jsonParser = bodyParser.json();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/test';
const ASE = require('./ase');


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
                res.status(200).json({
                    "code": -1,
                    "msg": err
                })
            },(result) => {
                if (result === null){
                    mongo.insert_many(db,'users',[body], (err) => {
                        res.status(200).json({
                            "code": -1,
                            "msg": err
                        })
                    },(result) => {
                        res.status(200).json({"code": 1,
                            "msg": 1})
                    })
                }else {
                    res.status(200).json({
                        "code": -1,
                        "msg": "账号已存在"
                    })
                }
            })
        })
        server.post('/user/login',jsonParser,function (req,res) {
            let body = req.body;
            mongo.find_one(db,'users',{"username":body.username},(err) => {
                res.status(200).json({
                    "code": -1,
                    "msg": err
                })
            },(result) => {
                if (result != null){
                    if (body.password === result.password){
                        let token = ASE.ase.Encrypt(body.username,ASE.key);
                        if (!req.headers.cookie){
                            res.set('Set-Cookie','sessionId='+token);
                        }
                        res.status(200).json({
                            "code": 1,
                            "msg": "token " + token
                        })
                    }else {
                        res.status(200).json({
                            "code": -1,
                            "msg": "密码错误"
                        })
                    }
                }else {
                    res.status(200).json({
                        "code": -1,
                        "msg": "用户不存在"
                    })
                }
            })
        })
        server.get('/user/info/:username',jsonParser,(req,res) => {
            let username = req.params.username;
            let body = req.body;
            mongo.find_one(db,'users',{"username":username},(err) => {
                res.status(200).json({
                    "code": -1,
                    "msg": err
                });
            },(result) => {
                if (result != null){
                    if (body.password === result.password){
                        res.status(200).json({
                            "code": 1,
                            "msg": {
                                "username": result.username,
                                "phone": result.phone,
                                "signature": result.signature
                            }
                        })
                    }else {
                        res.status(200).json({
                            "code": -1,
                            "msg": "密码错误"
                        })
                    }
                }else {
                    res.status(200).json({
                        "code": -1,
                        "msg": "用户不存在"
                    })
                }
            })
        })
        server.put('/user/info',jsonParser,(req,res) => {
            let body = req.body;
            let sessionId = req.headers.cookie.slice(10);
            let username = ASE.ase.Decrypt(sessionId,ASE.key);
            mongo.find_one(db,"users",{"username":username},(err) => {
                res.status(200).json({
                    "code": -1,
                    "msg": err
                })
            },(result) => {
                if (result.password === body.oldPassword){
                    mongo.update_one(db,"users",{
                        "password":result.password,
                        "phone":result.phone,
                        "signature":result.signature
                    },{$set:{
                            "password":body.newPassword,
                            "phone":body.phone,
                            "signature":body.signature
                        }},(err) => {
                        res.json({
                            "code": -1,
                            "msg": err
                        })
                    },(result) => {
                        res.json({
                            "code": 1,
                            "msg": 1
                        })
                    })
                }else {
                    res.json({
                        "code": -1,
                        "msg": "密码错误"
                    })
                }
            })
        })
    })

}




module.exports = router;