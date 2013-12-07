var http = require('http'),
	connect = require('connect'),
	express = require('express'),
	sio = require('socket.io'),
  path = require("path"),
  _ = require("underscore"),
  consolidate = require("consolidate"),
  cookie = require("cookie");

var sockets = require("./sockets"),
    auth = require("./auth");

var app = express();

var oneDay = 86400000;

app.use(
  connect.static(__dirname + '/../public', { maxAge: oneDay })
);

app.engine("html", consolidate.underscore);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "templates"));

app.use(express.cookieParser());
app.use(express.bodyParser());
var cookieSecret = "stationary-super-secret";
var oneDay = 1000 * 60 * 60 * 24;
var cookieSettings = {maxAge: oneDay};
app.use(connect.cookieSession({
  secret: cookieSecret,
  cookie: cookieSettings
}));

auth(app);

var server = http.createServer(app);

var io = sio.listen(server, {log: false});

io.set('authorization', function (data, callback) {
  if(data.headers.cookie) {
    var sessionCookie = cookie.parse(data.headers.cookie);
    var sessionId = connect.utils.parseSignedCookie(sessionCookie['connect.sess'], cookieSecret);
    var session = connect.utils.parseJSONCookie(sessionId);
    if(session && session.passport && typeof session.passport.user === "string")
      return callback(null, true);
  }
  return callback(null, false);
});

sockets(io);

server.listen(process.argv[2] || 80);