const mongoose = require("mongoose")

const paintingSchema = new mongoose.Schema({
    title: String,
    image: String, 
    artist: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
     },
    description: String,
    price: Number,
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ]
});

module.exports = mongoose.model("Painting", paintingSchema)