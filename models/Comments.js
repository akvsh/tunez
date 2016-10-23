var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    body: String,
    author: String,
    upbeats: {
        type: Number,
        default: 0
    },
    songPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song' //which model to use during population
    } //in reference to which song post this comment under
});

mongoose.model('Comment', CommentSchema);