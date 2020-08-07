var express = require("express");
var router  = express.Router();
var passport = require("passport");
var middleware = require("../middleware");
var User = require("../models/user");
var Painting = require("../models/painting");
var Comment = require("../models/comment");
var ObjectId = require('mongoose').Types.ObjectId;



//root route

   
router.get("/:id",middleware.isLoggedIn, function(req, res){
    let userPaintings;

    Painting.find({"artist.id": req.params.id}, function(err, paintings){
        if(err){
            console.log(err)
        }else {
            userPaintings = paintings;
        }
    })

    Comment.find({"artist.id":req.params.id}).exec(function(e, comments){
        if(e){
            console.log(e)
        } else {
            userComments = comments
            // console.log(`comments: ${comments}`)
            // // console.log(comments[0].paintings.id)
        res.render("users/profile", {userPaintings: userPaintings, userComments: userComments})

    }})

})
    
module.exports = router;
