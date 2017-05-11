var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleWare = require("../middleware");// should be ../middleware/index.js, but if require a directory, it will require the index file automaticly
var moment = require("moment");
var now = moment().format("ddd, hA");


//===========================
// routes
//===========================
//INDEX display a list of campgrounds
router.get("/", function(req, res){
    
    Campground.find({}, function(err, allCampgrounds){
          if(err){
            console.log(err);
        } else {
          res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });  
});

//NEW display forms to make a new campground
router.get("/new", middleWare.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//CREAT add new campground to DB
router.post("/", middleWare.isLoggedIn, function(req, res){
   var name = req.body.name;
   var image = req.body.image;
   var des = req.body.description;
   var price = req.body.price;
   var author = {
       id: req.user.id,
       username: req.user.username
   };
   var newCampground = {name:name, image:image, description:des, price:price, author:author};// name and image come form the form
   Campground.create(newCampground, function(err, campground){
       if(err){
           console.log(err);
       } else {
           res.redirect("/campgrounds");
       }
   });
});

//SHOW - shows more info about one campground
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){       //populate
        if(err){
            console.log("something went wrong when findind id");
        } else {
            res.render("campgrounds/show", {campground:foundCampground, now:now});
        }
    });
});

//edit
router.get("/:id/edit", middleWare.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground:foundCampground});
    });
});

//update
router.put("/:id", middleWare.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
            res.redirect("/campgrounds/" + req.params.id);
    });
});

//destroy
router.delete("/:id", middleWare.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
   }); 
});

module.exports = router;