const express = require("express");
const router = express.Router({mergeParams: true});
const Painting = require("../models/painting");
var middleware = require("../middleware");


// Show all Paintings 
router.get("/", function(req, res){
    // Get all paintings from DB
    let capitalizeFirstLetter = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    
    Painting.find({}, function(err, allPaintings){
       if(err){
           console.log(err);
       } else {
          res.render("paintings/index",{paintings:allPaintings, capitalizeFirstLetter: capitalizeFirstLetter});
       }
    });
});


router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var title = req.body.title;
    var image = req.body.image;
    var desc = req.body.description;
    var artist = {
        id: req.user._id,
        username: req.user.username
    }
    var price = req.body.price
    var newPainting = {title: title, image: image, description: desc, artist:artist, price: price}
    // Create a new campground and save to DB
    Painting.create(newPainting, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/paintings");
        }
    });
});



//NEW - show form to create new painting
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("paintings/new"); 
});


// SHOW - shows more info about one painting
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Painting.findById(req.params.id).populate("comments").exec(function(err, foundPainting){
        if(err){
            console.log(err);
        } else {
            console.log(`Found painting: ${foundPainting}`)
            res.render("paintings/show", {painting: foundPainting});
        }
    });
});

module.exports = router;
