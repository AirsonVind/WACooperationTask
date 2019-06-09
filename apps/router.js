const mongo = require('./mongo/mongo');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/test';
const handler = require('./controllers/handler');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const AES = require('./aes');

let router = (server) =>{
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) =>{
        if(err){
            console.log(err);
        }else{
            console.log('connected!');
        }
        let db = client.db('mydb');
        server.post('/user/reg',jsonParser,async (req,res) => {
            try {
                let body = req.body;
                let result = await mongo.find_one(db, 'users', {"username": body.username});
                if (result === null) {
                    await mongo.insert_many(db, 'users', [body]);
                    await res.status(200).json({
                        "code": 1,
                        "msg": 1
                    });
                } else {
                    await res.status(200).json({
                        "code": -1,
                        "msg": "Account already exists"
                    })
                }
            }catch (e) {
                res.status(200).json({
                    "code": -1,
                    "msg": e
                })
            }
        })

        server.post('/user/login',jsonParser,async (req,res) => {
            try {
                let body = req.body;
                let result = await mongo.find_one(db, 'users', {"username":body.username});
                if (result != null){
                    if (body.password === result.password){
                        let token = AES.aes.Encrypt(body.username,AES.key);
                        if (!req.headers.cookie){
                            res.set('Set-Cookie','sessionId='+token+';path=/');
                        }
                        res.status(200).json({
                            "code": 1,
                            "msg": "token " + token
                        })
                    }else {
                        res.status(200).json({
                            "code": -1,
                            "msg": "Wrong password"
                        })
                    }
                }else {
                    res.status(200).json({
                        "code": -1,
                        "msg": "User does not exist"
                    })
                }
            }catch (e) {
                res.status(200).json({
                    "code": -1,
                    "msg": e
                })
            }
        })

        server.get('/user/info/:username',jsonParser,async (req,res) => {
            let username = req.params.username;
            try {
                let result = await mongo.find_one(db,'users',{"username":username});
                if (result != null){
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
                        "msg": "User does not exist"
                    })
                }
            }catch (e) {
                res.status(200).json({
                    "code": -1,
                    "msg": e
                });
            }
        })

        server.put('/user/info',jsonParser,async (req,res) => {
            let body = req.body;
            let sessionId = req.headers.cookie.slice(10);
            try {
                let username = AES.aes.Decrypt(sessionId,AES.key);
                let result = await mongo.find_one(db,"users",{"username":username});
                if (!result){
                    res.status(200).json({
                        "code": -1,
                        "msg": "please log in first"
                    })
                }else {
                    if (result.password === body.oldPassword){
                        await mongo.update_one(db,"users",{
                            "password":result.password,
                            "phone":result.phone,
                            "signature":result.signature
                        },{$set:{
                                "password":body.newPassword,
                                "phone":body.phone,
                                "signature":body.signature
                            }});
                        await res.status(200).json({
                            "code": 1,
                            "msg": 1
                        });
                    }else {
                        res.status(200).json({
                            "code": -1,
                            "msg": "Wrong password"
                        })
                    }
                }
            }catch (e) {
                res.status(200).json({
                    "code": -1,
                    "msg": e
                })
            }
        })

        server.post('/friends', jsonParser, async (req, res) => {
            let body = req.body;
            let sessionId = req.headers.cookie.slice(10);
            try {
                let username = AES.aes.Decrypt(sessionId,AES.key);
                let result = await mongo.find_one(db,"users",{"username":username});
                if(!result){
                    res.status(200).json({
                        'code': -1,
                        'msg': 'please log in first',
                    })
                }else {
                    let friend_result = await mongo.find_one(db,"users",{"username":body.username});
                    if (friend_result){
                        await mongo.update_one(db,"users",{"username":username},{$push:{'friends' : body.username}});
                        await res.status(200).json({
                            "code": 1,
                            "msg": 1
                        })
                    }else {
                        res.status(200).json({
                            "code": -1,
                            "msg": 'friend username not exist'
                        })
                    }
                }
            }catch (e) {
                res.status(200).json({
                    "code": -1,
                    "msg": e
                })
            }
        })

        server.delete('/friends', jsonParser, async (req, res) =>{
            let body = req.body;
            let sessionId = req.headers.cookie.slice(10);
            try {
                let username = AES.aes.Decrypt(sessionId,AES.key);
                let result = await mongo.find_one(db,"users",{"username":username});
                if (!result){
                    res.status(200).json({
                        'code': -1,
                        'msg': 'please log in first',
                    })
                } else {
                    let friend_result = await mongo.find_one(db,"users",{"username":body.username});
                    if (friend_result){
                        await mongo.update_one(db,"users",{"username": username},{$pull:{'friends' : body.username}});
                        await res.status(200).json({
                            "code": 1,
                            "msg": 1
                        })
                    }else {
                        res.status(200).json({
                            "code": -1,
                            "msg": 'friend username not exist'
                        })
                    }
                }
            }catch (e) {
                res.status(200).json({
                    "code": -1,
                    "msg": e
                })
            }
        })

        server.get('/friends', jsonParser, async (req, res) => {
            let body = req.body;
            let sessionId = req.headers.cookie.slice(10);
            try {
                let username = AES.aes.Decrypt(sessionId,AES.key);
                let result = await mongo.find_one(db,"users",{"username":username});
                if (!result){
                    res.status(200).json({
                        'code': -1,
                        'msg': 'please log in first',
                    })
                } else {
                    let friends = result.friends;
                    let lastFriend = friends[friends.length - 1];
                    let msg = [];
                    for(let item of friends){
                        if(item){
                            let result = await mongo.find_one(db, 'users', {'username': item});
                            if (result){
                                await msg.push({
                                    'usernsme': result.username,
                                    'phone': result.phone,
                                })
                            }
                            if(result.username === lastFriend){
                                res.status(200).json({
                                    'code': 1,
                                    'msg': msg,
                                })
                            }
                        }
                    }
                }
            }catch (e) {
                res.status(200).json({
                    "code": -1,
                    "msg": e
                })
            }

        })

        server.post('/chat', jsonParser, async (req, res) => {
            let body = req.body;
            let sessionId = req.headers.cookie.slice(10);
            try {
                let username = AES.aes.Decrypt(sessionId,AES.key);
                let result = await mongo.find_one(db,"users",{"username":username});
                if (!result){
                    res.status(200).json({
                        'code': -1,
                        'msg': 'please log in first',
                    })
                } else {
                    body.sender = username;
                    await mongo.insert_many(db, 'new_msg', [body]);
                    await res.status(200).json({
                        'code': 1,
                        'msg': 1,
                    })
                }
            }catch (e) {
                res.status(200).json({
                    'code': -1,
                    'msg': e,
                })
            }
        })

        server.get('/chat', jsonParser, async (req, res) => {
            let sessionId = req.headers.cookie.slice(10);
            try {
                let username = AES.aes.Decrypt(sessionId,AES.key);
                let result = await mongo.find_one(db,"users",{"username":username});
                if (!result){
                    res.status(200).json({
                        'code': -1,
                        'msg': 'please log in first',
                    })
                } else {
                    let result = await mongo.find_all(db, 'new_msg', {'receiver': username});
                    console.log(username);
                    console.log(result);
                    await res.status(200).json({
                        'code': 1,
                        'msg': result
                    })
                    if (result.length !== 0) {
                        await mongo.insert_many(db, 'msg', result);
                    }
                    await mongo.delete_many(db, 'new_msg', {'receiver': username});
                }
            }catch (e) {
                res.status(200).json({
                    'code': -1,
                    'msg': e,
                })
            }
        })
    })
}




module.exports = router;