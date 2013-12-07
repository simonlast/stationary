var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  bcrypt = require("bcrypt"),
  fs = require("fs"),
  path = require("path");

var db = require("./db");

// Load credentials
var authJSON = fs.readFileSync(path.join(__dirname, "auth.json"));
var authCredentials = JSON.parse(authJSON);


module.exports = function(app){

  var authenticate = function(username, password, done){
    if(username !== authCredentials.username){
      return done(null, false, {error: "Incorrect username"});
    }

    bcrypt.compare(password, authCredentials.hash, function(err, res){
      if(res && !err){
        return done(null, {username: username});
      }else{
        return done(err, false, {error: "Incorrect password"});
      }
    });
  };

  serializeUser = function(user, done) {
    done(null, user.username);
  };

  deserializeUser = function(id, done) {
    return done(null, {username: id});
  };

  passport.use(new LocalStrategy(authenticate));
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
  app.use(passport.initialize());
  app.use(passport.session());

  ensureAuthenticated = function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }else{
      res.send(404);
    }
  };

  authenticationSettings = {
    successRedirect: "/",
    failureRedirect: "/login",
  };

  app.get("/login", function(req, res){
    res.render("login.html");
  });

  app.get("/logout", function(req, res){
    req.logout();
    res.redirect('/login');
  });

  app.post("/login", passport.authenticate("local", authenticationSettings));

  var renderFile = function(id, res){
    db.get(id, function(err, value){
      if(err){
        res.send(404);
      }else{
        res.send(value);
      }
    });
  };

  app.get("/file/:id", function(req, res){
    var id = req.params.id;
    renderFile(id, res);
  });

  app.get("/", function(req, res){
    var id = req.params.id;
    if(req.isAuthenticated()){
      res.render("index.html");
    }else{
      renderFile("home.html", res);
    }
  });

  app.get("/:id", function(req, res){
    var id = req.params.id;
    if(req.isAuthenticated()){
      res.render("index.html");
    }else{
      renderFile(id, res);
    }
  });

  app.all("*", ensureAuthenticated);
};