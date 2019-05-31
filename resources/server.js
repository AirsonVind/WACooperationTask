const express = require('express');
const mongo = require('./mongo');
const crypto = require('crypto');
const MongoClient = require('mongodb').MongoClient;
let url = 'mongodb://localhost:27017/test';



function ASE(){

    this.Encrypt = (data, key) => {
        let cipher = crypto.createCipher('aes192', key);
        let crypted = cipher.update(data, 'utf8', 'hex');
        crypted = crypted + cipher.final('hex');
        return crypted;
    }

    this.Decrypt = (encrypt, key, authTag) => {
        let decipher = crypto.createDecipher('aes192', key);
        let decrypted = decipher.update(encrypt, 'hex', 'utf8');
        decrypted = decrypted + decipher.final('utf8');
        return decrypted;
    }
}

const ase = new ASE();
const key = Buffer.from('WACooperationTask');



let server = express().listen(2333);

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

    router.info_search(server);
}

startServer();

