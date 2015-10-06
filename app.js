"use strict";

var path = require("path");
var express = require("express");
var session = require("express-session");
var logger = require("morgan");
var bodyParser = require("body-parser");

var passport = require("passport");
var LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

var saveProfile = require("./integrate.js");

var LINKEDIN_API_KEY = process.env.LINKEDIN_API_KEY;
var LINKEDIN_SECRET_KEY = process.env.LINKEDIN_SECRET_KEY;

var ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect("/");
};

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new LinkedInStrategy({
  clientID: LINKEDIN_API_KEY,
  clientSecret: LINKEDIN_SECRET_KEY,
  callbackURL: "http://localhost:3000/auth/callback",
  scope: ["r_basicprofile", "r_emailaddress"],
  passReqToCallback: true
},
function(req, accessToken, refreshToken, profile, done) {
  req.session.accessToken = accessToken;
  process.nextTick(function() {
    return done(null, profile);
  });
}));

var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: "123123h123jk123hk",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


app.get("/", function (req, res) {
  res.render("index", { user: req.user });
});

app.get("/map", ensureAuthenticated, function (req, res) {
  res.render("map", {});
});

app.get("/auth/login", passport.authenticate("linkedin", { state: "temp_state" }), function (req, res) {
  // wont be called
});

app.get("/auth/callback",
  passport.authenticate("linkedin", { failureRedirect: "/"}), function (req, res) {
    saveProfile(req.user.id, req.session.accessToken);
    res.render("map");
  }
);

var server = app.listen(process.env.PORT || 3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("listening at http://%s:%s", host, port);
});



