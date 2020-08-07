var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req, res){
    res.render("landing");
});


// show register form
router.get("/register", function(req, res){
    res.render("register"); 
 });

 //handle sign up logic
 router.post("/register", function(req, res){
     console.log(req.body)
    var newUser = new User({username: req.body.username ,image: req.body.image});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", `Welcome to Amazing Art Gallery, ${user.username.toUpperCase()}`);
           res.redirect("/paintings"); 
        });
    });
});


 router.get("/login", function(req, res){
    res.render("login");
 });

router.post('/login', passport.authenticate('local' , {failureRedirect:'/login', failureFlash: true}),
function(req, res) {
    req.flash("success", `Welcome back, ${req.user.username.toUpperCase()}`);
    res.redirect('/paintings');
});

 router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have been logged out!");
    res.redirect("/paintings");
 });

module.exports = router;
