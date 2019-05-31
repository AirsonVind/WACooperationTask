let insert_many = (db, collection, data, callback) => {
    db.collection(collection).insertMany(data, (err, result) => {
        if(err){
            console.log(err);
        }else{
            callback(result);
        }
    })
}

let delete_one = (db, collection, data, callback) => {
    db.collection(collection).deleteOne(data, (err, result) => {
        if(err){
            console.log(err);
        }else{
            callback(result);
        }
    })
}

let update_one = (db, collection, fliter, data, callback) => {
    db.collection(collection).updateOne(fliter, data, {upsert: false}, (err, result) => {
        if(err){
            console.log(err);
        }else{
            callback(result);
        }
    })
}

let find_one = (db, collection, data, callback) => {
    db.collection(collection).findOne(data, (err, result) => {
        if(err){
            console.log(err);
        }else{
            console.log('found');
            callback(result);
        }
    })
}


let find_all = (db, collection, data, callback) => {
    db.collection(collection).find(data).toArray((err, result) => {
        if(err){
            console.log(err);
        }else{
            console.log('found-all');
            callback(result);
        }
    })
}

module.exports.insert_many = insert_many;
module.exports.delete_one = delete_one;
module.exports.update_one = update_one;
module.exports.find_one = find_one;
module.exports.find_all = find_all;
