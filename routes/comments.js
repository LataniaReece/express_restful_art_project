  
var express = require("express");
var router  = express.Router({mergeParams: true});
var Painting = require("../models/painting");
var Comment = require("../models/comment");
var middleware = require("../middleware");



//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    console.log(req.params.id);
    Painting.findById(req.params.id, function(err, painting){
        if(err){
            console.log(err);
        } else {
            // console.log(`These are the parameters: ${JSON.stringify(req.params)}`)
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
                // console.log(`resulting comment: ${comment}`)
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

 // COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else {
         res.render("comments/edit", {painting_id: req.params.id, comment: foundComment});
       }
    });
 });

 // COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/paintings/" + req.params.id );
       }
    });
 });
 

 // DELETE COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
       Comment.findByIdAndRemove(req.params.comment_id, {useFindAndModify: false}, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/paintings/" + req.params.id);
       }
    });
});


module.exports = router;
