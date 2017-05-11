var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/", function(req, res){
    res.render("landing");
});

//============================
//  AUTH ROUTES
//============================
// show sign up form
router.get("/register", function(req, res) {
    res.render("register");
});

// handling sign up
router.post("/register", function(req, res){
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            req.flash("error",err.message);//err is from mongoose passport-local package
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","Welcome to Yelpcamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//============================
//  LOGIN ROUTES
//============================
//show login form
router.get("/login", function(req, res) {
    res.render("login");
});
//login logic
//app.post("/login", middleware, callback)
router.post("/login",passport.authenticate("local",  //see passport configuration
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),function(req, res) {
});

//============================
//  LOGOUT ROUTES
//============================
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next(); // move on to the next thing
    }
    res.redirect("/login");
}

module.exports = router;