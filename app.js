const express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User        = require("./models/user");


    
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Crazy Crazy!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// requiring routes 
const indexRoutes  = require("./routes/index");
const paintingRoutes = require("./routes/paintings");
const commentRoutes    = require("./routes/comments");
const userRoutes = require("./routes/user")

mongoose.connect("mongodb://localhost:27017/art_gallery", { useNewUrlParser: true, useUnifiedTopology: true});    app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.capitlizeFirstLetter = function(string){
     return string.charAt(0).toUpperCase() + string.slice(1);
    };
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.warning = req.flash("warning");
    next();
 });

app.use("/", indexRoutes);
app.use("/paintings", paintingRoutes)
app.use("/paintings/:id/comments", commentRoutes);
app.use("/user", userRoutes);

app.listen("3000",  ()=>{
    console.log("This is working");
    });


