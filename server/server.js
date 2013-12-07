var http = require('http'),
	connect = require('connect'),
	express = require('express'),
	sio = require('socket.io'),
  levelup = require('levelup'),
  path = require("path"),
  _ = require("underscore"),
  consolidate = require("consolidate");

var app = express();
var db = levelup(path.join(__dirname, 'book-db'));

var oneDay = 86400000;

app.use(
  connect.static(__dirname + '/../public', { maxAge: oneDay })
);

app.engine("html", consolidate.underscore);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "templates"));

app.get("/file/:id", function(req, res){
  var id = req.params.id;
  db.get(id, function(err, value){
    if(err){
      res.send(404);
    }else{
      res.send(value);
    }
  });
});

app.get("*", function(req, res){
  res.render("index.html");
});

var server = http.createServer(app);

var io = sio.listen(server, {log: false});

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

server.listen(process.argv[2] || 80);