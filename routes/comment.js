var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleWare = require("../middleware");// should be ../middleware/index.js, but if require a directory, it will require the index file automaticly

//============================
//  COMMENTS ROOUTES
//============================
router.get("/new", middleWare.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
              res.render("comments/new", {campground:foundCampground}); 
        }
    });
});

//comments create
router.post("/", middleWare.isLoggedIn, function(req, res){
    // Look up campground by id
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else { // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error","something went wrong!")
                    console.log(err);
                } else {
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    //asociate comment to campground
                    // connect new comment to campground
                    // redirect to show page
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    req.flash("success","Successfully added comment");
                    res.redirect('/campgrounds/' + foundCampground.id);
                }
            });
        }
    });
});

//comments edit  /campgrounds/:id/comments/:comment_id/edit
router.get("/:comment_id/edit", middleWare.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        res.render("comments/edit",{campground_id: req.params.id, comment: foundComment}); 
    });       
});


//comments update     /campgrounds/:id/comments/:comment_id
router.put("/:comment_id", middleWare.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    }
);
});
  
//comments destroy   /campgrounds/:id/comments/:comment_id
router.delete("/:comment_id", middleWare.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;