var mongoose = require('mongoose');

//Schema for the DB for our posts
var SongSchema = new mongoose.Schema({
    title: String,
    link: String,
    upbeats: {
        type: Number,
        default: 0
    },
    comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment' //which model to use during population
    }] //uses Mongoose's built in populate method to retreive array of Comment references
});

//increment song post upbeats and save to db
//cb is the callback function
SongSchema.methods.upbeat = function (cb) {
    this.upbeats += 1;
    this.save(cb);
};

//decrement song post upbeats and save to db
//cb is the callback function
SongSchema.methods.downbeat = function (cb) {
    this.upbeats -= 1;
    this.save(cb);
};


mongoose.model('Song', SongSchema);