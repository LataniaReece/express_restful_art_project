var Painting = require("../models/painting");
// all the middleare goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("warning", "Please log in first!");
    res.redirect("/login");
}

module.exports = middlewareObj;