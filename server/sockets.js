var db = require("./db");

module.exports = function(io){

  io.sockets.on("connection", function(socket){

    socket.on("set", function(data){

      db.set(data.id, data.value, function(err){
        socket.broadcast.emit("watch", data);
      });

    });

    socket.on("get", function(data, fn){

      db.get(data.id, function (err, value) {
        if(err){
          fn({err: "not found"});
        }else{
          fn({value: value});
        }
      });

    });

    socket.on("all", function(data, fn){
      db.all(function(err, keys){
        fn(keys);
      });

    });

    socket.on("remove", function(data){
      db.remove(data.id);
    });

  });

};