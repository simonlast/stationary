/*
 * routes.js manages authentication and application routing.
 */

var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  bcrypt = require("bcrypt"),
  fs = require("fs"),
  path = require("path");

var db = require("./db");

// Load credentials from auth.json.
var authCredentialsPath = path.join(__dirname, "auth.json");
var authCredentials = null;

var loadCredentials = function(){
  if(fs.existsSync(authCredentialsPath)){
    var authJSON = fs.readFileSync(authCredentialsPath);
    authCredentials = JSON.parse(authJSON);
  }
};

var saveCredentials = function(username, password, callback){
  bcrypt.hash(password, 8, function(err, hash) {

    authCredentials = {
      username: username,
      hash: hash
    };

    var authJSON = JSON.stringify(authCredentials);
    fs.writeFile(authCredentialsPath, authJSON, "utf8", callback);
  });
};

loadCredentials();

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


  deserializeUser = function(username, done) {
    if(authCredentials && username === authCredentials.username){
      return done(null, {username: username});
    }else{
      return done(null, false);
    }
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


  validateSignup = function(form){
    if(typeof form.username !== "string" || form.username.length < 1){
      return false;
    }

    if(typeof form.password !== "string" || form.password.length < 6){
      return false;
    }

    if(form.password !== form.confirmPassword){
      return false;
    }

    return true;
  };


  app.post("/signup", function(req, res, next){
    if(!authCredentials){
      var form = req.body;
      var isValid = validateSignup(form);

      if(!isValid){
        return res.redirect("/signup");
      }

      saveCredentials(form.username, form.password, function(err){
        if(err){
          return res.send(302);
        }

        passport.authenticate("local", authenticationSettings)(req, res, next);
      });
    }else{
      next();
    }
  });


  app.get("/signup", function(req, res, next){
    if(!authCredentials){
      res.render("signup.html");
    }else{
      next();
    }
  });


  app.get("*", function(req, res, next){
    if(!authCredentials){
      res.redirect("/signup");
    }else{
      next();
    }
  });


  app.get("/login", function(req, res){
    res.render("login.html");
  });


  app.get("/logout", function(req, res){
    req.logout();
    res.redirect('/login');
  });


  app.post("/login", passport.authenticate("local", authenticationSettings));


  var fileTypeRegex = /.*\.([A-Za-z]+)/;
  var getFileType = function(filename){
    var matches = fileTypeRegex.exec(filename);
    if(matches && matches.length == 2){
      return matches[1];
    }else{
      return "html";
    }
  };

  var renderFile = function(id, res){
    var type = getFileType(id);
    res.setHeader("Content-Type", "text/" + type);
    db.get(id, function(err, value){
      if(err){
        res.send(404);
      }else{
        res.send(value);
      }
    });
  };


  app.get("/", function(req, res){
    var id = req.params.id;
    if(req.isAuthenticated()){
      res.redirect("/edit/index.html");
    }else{
      renderFile("index.html", res);
    }
  });


  app.get("/edit/:id", function(req, res){
    var id = req.params.id;
    if(req.isAuthenticated()){
      res.render("index.html", {file: id});
    }else{
      res.redirect("/" + id);
    }
  });


  app.get("/:id", function(req, res){
    var id = req.params.id;
    renderFile(id, res);
  });


  app.all("*", ensureAuthenticated);

};