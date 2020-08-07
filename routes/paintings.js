const express = require("express");
const router = express.Router({mergeParams: true});
const Painting = require("../models/painting");
const Comment = require("../models/comment");
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
    Painting.findById(req.params.id).populate("comments").exec(function(err, foundPainting){
        if(err){
            console.log(err);
        } else {
            res.render("paintings/show", {painting: foundPainting});
        }
    });
});

router.get("/:id/edit", middleware.checkPaintingOwnership, function(req, res){
    Painting.findById(req.params.id, function(err, foundPainting){
       if(err){
           res.redirect("back");
       } else {
         res.render("paintings/edit", {painting_id: req.params.id, painting: foundPainting});
       }
    });
 });

 // Painting UPDATE
router.put("/:id", middleware.checkPaintingOwnership, function(req, res){
    var desc = req.body.description;
    var price = req.body.price
    var updatedData = {description: desc, price: price}
    Painting.findByIdAndUpdate(req.params.id, updatedData, function(err, updatedPaintingData){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/paintings/" + req.params.id );
       }
    });
 });
 

 // PAINTING DESTROY ROUTE
router.delete("/:id", middleware.checkPaintingOwnership, function(req, res){
       Painting.findByIdAndRemove(req.params.id, {useFindAndModify: false}, function(err, deletedPainting){
       if(err){
           res.redirect("/");
       } else {
            Comment.deleteOne({painting: deletedPainting}, function(err, deletedPainting){
                if(err){
                   console.log(err)         
                }else{
                    req.flash("success", "Painting deleted");
                    res.redirect("/paintings");   
                }
            })
          
       }
    });
});




module.exports = router;
