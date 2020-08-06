  
var express = require("express");
var router  = express.Router({mergeParams: true});
var Painting = require("../models/painting");
var Comment = require("../models/comment");
var middleware = require("../middleware");



//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find campground by id
    console.log(req.params.id);
    Painting.findById(req.params.id, function(err, painting){
        if(err){
            console.log(err);
        } else {
            console.log(`These are the parameters: ${JSON.stringify(req.params)}`)
             res.render("comments/new", {painting: painting});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
    //lookup painting using ID
    Painting.findById(req.params.id, function(err, painting){
        if(err){
            console.log(err);
            res.redirect("/paintings");
        } else {
            
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                //add username and id to comment
                console.log(`resulting comment: ${comment}`)
                comment.artist.id = req.user._id;
                comment.artist.username = req.user.username;
                comment.painting.id = req.params.id;
                //save comment
                comment.save();
                painting.comments.push(comment);
                painting.save();
                req.flash("success", "Comment Added!");
                res.redirect('/paintings/' + painting._id);
            }
         });
        }
    });
 });


module.exports = router;
