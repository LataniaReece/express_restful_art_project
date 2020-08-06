var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    headline: String,
    text: String,
    artist: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }, 
    painting: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Painting"
        }
    }
});

module.exports = mongoose.model("Comment", commentSchema);