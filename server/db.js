var path = require("path"),
    fs = require("fs"),
    _ = require("underscore");


var db = {};
var rootPath = path.join(__dirname, "files");

db.get = function(id, callback){
  var filename = path.join(rootPath, id);
  fs.readFile(filename, "utf8", callback);
};

db.set = function(id, value, callback){
  var filename = path.join(rootPath, id);
  fs.writeFile(filename, value, "utf8", callback);
};


db.all = function(callback){
  fs.readdir(rootPath, function(err, keys){
    if(err){
      return callback(err);
    }

    keys = _.filter(keys, function(key){
      return key[0] !== ".";
    });

    return callback(err, keys);
  });
};

db.remove = function(id, callback){
  var filename = path.join(rootPath, id);
  fs.unlink(filename, callback);
};

module.exports = db;