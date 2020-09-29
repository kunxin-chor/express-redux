const dbname = "animal_shelter";
const client = require('mongodb').MongoClient;
let _db;

function connect(url, dbname) {   
    client.connect(url, {
        useUnifiedTopology:true
    }, function(err, client){
        _db = client.db(dbname);     
    })
}

function getDB() {
    return _db;
}

module.exports = {
    connect, getDB
}