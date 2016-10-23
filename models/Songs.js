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

mongoose.model('Song', SongSchema);