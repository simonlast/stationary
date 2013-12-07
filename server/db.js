module.exports = function(io, db){

  io.sockets.on("connection", function(socket){

    socket.on("set", function(data){

      db.put(data.id, data.value);
      socket.broadcast.emit("watch", data);

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
      var keys = [];

      db.createKeyStream()
        .on("data", function (data) {
          keys.push(data);
        })
        .on("end", function(){
          fn(keys);
        });

    });

    socket.on("remove", function(data){
      db.del(data.id);
    });

  });

};