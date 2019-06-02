const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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
                        "msg": "账号已存�?"
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
                            "msg": "密码错�??"
                        })
                    }
                }else {
                    res.json({
                        "code": -1,
                        "msg": "用户不存�?"
                    })
                }
            })
        })

        server.post('/friends', jsonParser, (req, res) => {
            let body = req.body;
            mongo.find_one(db, 'users', {'username' : body.username}, (err) => {
                res.json({
                    'code': -1,
                    'msg': err,
                })
            }, (result) => {
                if(!result){
                    res.json({
                        'code': -1,
                        'msg': 'username not exist',
                    })
                }else{
                    let newfriend = body.friend;
                    mongo.update_one(db, 'users', {'username' : body.username}, {$push:{'friends' : newfriend}}, (err) =>{
                        res.json({
                            'code': -1,
                            'msg': err,
                        })
                    }, (result) => {
                        res.json({
                            'code': 1,
                            'msg': 1,
                        })
                    })
                }
            })
        })

        server.delete('/friends', jsonParser, (req, res) =>{
            let body = req.body;
            mongo.find_one(db, 'users', {'username': body.username}, (err) => {
                res.json({
                    'code': -1,
                    'msg': err,
                })
            }, (result) => {
                if(!result){
                    res.json({
                        'code': -1,
                        'msg': 'username not exist',
                    })
                }else{
                    console.log(result.friends);
                    let friend = body.friend;
                    mongo.update_one(db, 'users', {'username': body.username}, {$pull:{'friends': friend}}, (err) => {
                        res.json({
                            'code': -1,
                            'msg': err,
                        })
                    }, (result) => {
                        res.json({
                            'code': 1,
                            'msg': 1,
                        })
                    })
                }
            })
        })

        server.get('/friends', jsonParser, (req, res) => {
            let body = req.body;
            mongo.find_one(db, 'users', {'username': body.username}, (err) => {
                res.json({
                    'code': -1,
                    'msg': err,
                })
            }, (result) => {
                let friends = result.friends;
                let lastFriend = friends.pop();
                friends.push(lastFriend);
                let msg = [{'username': result.username}];
                console.log(friends);
                for(let item of friends){
                    if(item){
                        console.log(item);
                        mongo.find_one(db, 'users', {'username': item}, (err) => {
                            res.json({
                                'code': -1,
                                'msg': err,
                            })
                        }, (result) => {
                            console.log(result.username);
                            msg.push({
                                'usernsme': result.username,
                                'phone': result.phone,
                            })
                            console.log(msg);
                            if(result.username === lastFriend){
                                res.json({
                                    'code': 1,
                                    'msg': msg,
                                })
                            }
                        })
                    }
                }
            })
        })

        server.post('/chat', jsonParser, (req, res) => {
            let body = req.body;
            mongo.insert_many(db, 'new_msg', [body], (err) => {
                res.json({
                    'code': -1,
                    'msg': err,
                })
            }, (result) => {
                res.json({
                    'code': 1,
                    'msg': 1,
                })
                console.log(result);
            })
        })

        server.get('/chat', jsonParser, (req, res) => {
            let body = req.body;
            mongo.find_all(db, 'new_msg', {'receiver': body.username}, (err) => {
                res.json({
                    'code': -1,
                    'msg': err,
                })
            }, (result) => {
                console.log(result);
                console.log(typeof result);
                res.json({
                    'code': 1,
                    'msg': result,
                })
                if(result.lenth !== 0){
                    mongo.insert_many(db, 'msg', result, (err) => {
                        res.json({
                            'code': -1,
                            'msg': err,
                        })
                    }, (result) => {
                        console.log(result);
                    })
                }
            })
            mongo.delete_many(db, 'new_msg', {'receiver': body.username}, (err) => {
                res.json({
                    'code': -1,
                    'msg': err,
                })
            }, (result) => {
                console.log(result);
            })
        })
    })
}




module.exports = router;
