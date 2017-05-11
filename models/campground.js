var mongoose = require("mongoose");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   price: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
       }
    ]
});
// compell --campgroundSchema-- into a Model
// var Campground = mongoose.model("Campground", campgroundSchema); 

module.exports = mongoose.model("Campground", campgroundSchema);