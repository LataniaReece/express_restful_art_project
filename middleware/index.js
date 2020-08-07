var Painting = require("../models/painting");
var Comment = require("../models/comment");
// all the middleare goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("warning", "Please log in first!");
    res.redirect("/login");
}

middlewareObj.checkPaintingOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
           Painting.findById(req.params.id, function(err, foundPainting){
              if(err){
                  req.flash("error", "Painting not found");
                  res.redirect("back");
              }  else {
                  // does user own the campground?
               if(foundPainting.artist.id.equals(req.user._id)) {
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that");
                   res.redirect("back");
               }
              }
           });
       } else {
           req.flash("error", "You need to be logged in to do that");
           res.redirect("back");
       }
   }
   
   middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
           Comment.findById(req.params.comment_id, function(err, foundComment){
              if(err){
                  res.redirect("back");
              }  else {
                  // does user own the comment?
               if(foundComment.artist.id.equals(req.user._id)) {
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that");
                   res.redirect("back");
               }
              }
           });
       } else {
           req.flash("error", "You need to be logged in to do that");
           res.redirect("back");
       }
    }

module.exports = middlewareObj;