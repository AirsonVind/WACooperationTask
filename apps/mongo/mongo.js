let insert_many = (db, collection, data) => {
    return db.collection(collection).insertMany(data);
}

let delete_one = (db, collection, data) => {
    return db.collection(collection).deleteOne(data);
}

let delete_many = (db, collection, data) => {
    return db.collection(collection).deleteMany(data)
}

let update_one = (db, collection, fliter, data) => {
    return db.collection(collection).updateOne(fliter, data, {upsert: false});
}

let find_one = (db, collection, data) => {
    return db.collection(collection).findOne(data);
}

let find_all = (db, collection, data) => {
    return db.collection(collection).find(data).toArray();
}

module.exports = {insert_many, delete_one, delete_many, update_one, find_one, find_all};