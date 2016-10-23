var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Song = mongoose.model('Song');
var Comment = mongoose.model('Comment');

//get all of the song posts (the front page essentially)
router.get('/songs', function (req, res, next) {
    //query the db for all song posts
    Song.find(function (err, posts) {
        if (err) {
            //express error handling
            return next(err);
        }
        //json response of song posts
        res.json(posts)
    });
});

//add new song post and save to our db
router.post('/songs', function (req, res, next) {
    var song = new Song(req.body);

    song.save(function (err, song) {
        if (err) {
            return next(err);
        }

        res.json(song);
    });
});


router.param('id', function (req, res, next, id) {
    Song.findById(id, function (err, song) {
        if (err) {
            return next(err);
        }
        //if the song post doesn't exist
        if (!song) {
            return next(new Error('cannot find song post'));
        }
        req.song = song;
        console.log(req.song);
        return next();
    });
});

router.param('commentId', function (req, res, next, commentId) {
    Song.comments.findById(commentId, function (err, comment) {
        if (err) {
            return next(err);
        }
        //if the comment doesn't exist
        if (!comment) {
            return next(new Error('cannot find song post'));
        }
        req.comment = comment;
        console.log(req.comment);
        return next();
    });
});


//getting single song post data
router.get('/songs/:id', function (req, res) {
    res.json(req.song);
});


//upbeat song post
router.put('/songs/:id/upbeat', function (req, res, next) {
    req.song.upbeat(function (err, song) {
        if (err) {
            return next(err);
        }
        res.json(song);
    });
});

//getting all comments of a certain song post
router.post('/songs/:id/comments', function (req, res, next) {
    console.log(req.body);
    var comment = new Comment(req.body);
    //set comment to the request
    comment.songPost = req.songPost;

    //add it to our db and save for this song post
    comment.save(function (err, comment) {
        if (err) {
            return next(err);
        }

        //add new comment to array of comments
        req.song.comments.push(comment);
        //save new state of song w/ new comment
        req.song.save(function (err, song) {
            if (err) {
                return next(err);
            }
            res.json(comment);
        });
    });
});

//upbeat a specific comment on a specific song post
router.put('/songs/:id/comments/:commentId/upvote', function (req, res, next) {
    req.song.upbeat(function (err, song) {
        if (err) {
            return next(err);
        }
        res.json(song);
    });
});

module.exports = router;