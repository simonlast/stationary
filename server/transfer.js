var path = require("path");
var db = require("./db");
var _ = require("underscore");
var levelup = require('levelup');

var level = levelup(path.join(__dirname, "db"));

var keys = [];

level.createKeyStream()
  .on("data", function (data) {
    keys.push(data);
  })
  .on("end", function(){

    _.each(keys, function(key){

      level.get(key, function(err, data){

          db.set(key, data);

      });
    });

  });