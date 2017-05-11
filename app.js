var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    passport     = require("passport"),
    LocalStrategy= require("passport-local"),
    Campground   = require("./models/campground"),
    Comment      = require("./models/comment"),
    User         = require("./models/user"),  
    methodOverride = require("method-override"),
    flash          = require("connect-flash"),
    seedDB       = require("./seeds");

//REQURING ROUTES    
var campgroundsRoutes = require("./routes/campgrounds"),
    commentRoutes     = require("./routes/comment"),
    indexRoutes       = require("./routes/index");
    
mongoose.Promise = global.Promise;
//mongoose.connect("mongodb://localhost/yelp_camp");
//mongoose.connect("mongodb://Chelsea:123@ds137141.mlab.com:37141/yelpcamp-chelsea");
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url);

app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Mia is cute",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//METHOD-User.authenticate() is from package passportLocalMongoose, see user.ejs
passport.serializeUser(User.serializeUser());//encode it, serialize it and put it back in the session
passport.deserializeUser(User.deserializeUser());//reading the session, taking the data from the session that's encoded and unencode it

//Pass in different req.something into res.locals, so they are avaliable to every template
app.use(function(req, res, next){
    res.locals.currentUser = req.user; 
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundsRoutes); //all camgroundsRoutes should start with /campgrounds
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server started!");
});