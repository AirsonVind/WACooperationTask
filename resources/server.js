const express = require('express');
const mongo = require('./mongo');
console.log(mongo);
const MongoClient = require('mongodb').MongoClient;
let url = 'mongodb://localhost:27017/test';


let server = express().listen(2333);

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

