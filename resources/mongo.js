let insert_many = (db, collection, data, callback_err,callback_ok) => {
    db.collection(collection).insertMany(data, (err, result) => {
        if(err){
            console.log(err);
            callback_err(err);
        }else{
            callback_ok(result);
        }
    })
}

let delete_one = (db, collection, data, callback_err,callback_ok) => {
    db.collection(collection).deleteOne(data, (err, result) => {
        if(err){
            console.log(err);
            callback_err(err);
        }else{
            callback_ok(result);
        }
    })
}

let delete_many = (db, collection, data, callback_err,callback_ok) => {
    db.collection(collection).deleteMany(data, (err, result) => {
        if(err){
            console.log(err);
            callback_err(err);
        }else{
            callback_ok(result);
        }
    })
}

let update_one = (db, collection, fliter, data, callback_err, callback_ok) => {
    db.collection(collection).updateOne(fliter, data, {upsert: false}, (err, result) => {
        if(err){
            console.log(err);
            callback_err(err)
        }else{
            callback_ok(result);
        }
    })
}

let find_one = (db, collection, data, callback_err,callback_ok) => {
    db.collection(collection).findOne(data, (err, result) => {
        if(err){
            console.log(err);
            callback_err(err);
        }else{
            console.log('found');
            callback_ok(result);
        }
    })
}


let find_all = (db, collection, data, callback_err,callback_ok) => {
    db.collection(collection).find(data).toArray((err, result) => {
        if(err){
            console.log(err);
            callback_err(err);
        }else{
            console.log('found-all');
            callback_ok(result);
        }
    })
}

module.exports = {insert_many, delete_one, delete_many, update_one, find_one, find_all};