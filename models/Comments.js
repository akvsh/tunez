var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    body: String,
    author: String,
    upbeats: {
        type: Number,
        default: 0
    },
    song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song' //which model to use during population
    } //in reference to which song post this comment under
});

//update comment upbeats and save to db
//cb is the callback function
CommentSchema.methods.upbeat = function (cb) {
    this.upbeats += 1;
    this.save(cb);
};


mongoose.model('Comment', CommentSchema);