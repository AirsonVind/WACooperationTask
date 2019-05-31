const express = require('express');
const mongo = require('./mongo');
console.log(mongo);
const MongoClient = require('mongodb').MongoClient;
let url = 'mongodb://localhost:27017/test';


let router = require('./router');

MongoClient.connect(url, {useNewUrlParser: true}, (err, client) =>{
    if(err){
        console.log(err);
    }else{
        console.log('connected!');
    }
    let db = client.db('mydb');
    mongo.find_one(db, 'users', {username: "nsq"}, (result) => {
        console.log(result);
    })
})


function startServer() {
    let server = express();
    server.listen(2333);
    server.get('/',function (req,res) {
        res.send('ok');
        console.log('server connected');
    })
    router.register(server);
}

startServer();

