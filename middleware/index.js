//all middleware
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
     //is user logged in
    if(req.isAuthenticated()){
        //does user own the campground
        Campground.findById(req.params.id, function(err, foundCampground){//foundCampground.author.id is an object, not a string
            if(err){
                req.flash("error", "Campground not found!");
                res.redirect("back");
            } else {
                /*console.log(foundCampground.author.id);
                console.log(req.user.id);
                console.log(req.params.id);*/
                if(foundCampground.author.id.equals(req.user.id)){ //built-in .equals from mongoose
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
     //is user logged in
    if(req.isAuthenticated()){
        //does user own the comment
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Comment not found!");
                res.redirect("back");
            } else {
              /*  console.log(foundComment.author.id);
                console.log(req.user);
                console.log(req.params.id);*/
                if(foundComment.author.id.equals(req.user.id)){ //foundComment.author.id is an mongoose object, not a string. req.user.id is a passport id.Built-in method .equals is from mongoose
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next(); // move on to the next thing
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};

module.exports = middlewareObj;