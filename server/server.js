var http = require('http'),
	connect = require('connect'),
	express = require('express'),
	sio = require('socket.io'),
  levelup = require('levelup'),
  path = require("path"),
  _ = require("underscore"),
  consolidate = require("consolidate");

var dbDriver = require("./db"),
    auth = require("./auth");

var app = express();
var db = levelup(path.join(__dirname, "db"));

var oneDay = 86400000;

app.use(
  connect.static(__dirname + '/../public', { maxAge: oneDay })
);

app.engine("html", consolidate.underscore);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "templates"));

app.use(express.cookieParser());
app.use(express.bodyParser());
var secret = "stationary-super-secret";
var oneDay = 1000 * 60 * 60 * 24;
var cookie = {maxAge: oneDay};
app.use(connect.cookieSession({
  secret: secret,
  cookie: cookie
}));

auth(app, db);

app.get("*", function(req, res){
  res.render("index.html");
});

var server = http.createServer(app);

var io = sio.listen(server, {log: false});

dbDriver(io, db);

server.listen(process.argv[2] || 80);