var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Song = mongoose.model('Song');
var Comment = mongoose.model('Comment');


// home page
router.get('/', function (req, res, next) {
    res.render('index');
});


//get all of the song posts (the front page essentially)
router.get('/songs', function (req, res, next) {

    //query the db for all song posts
    Song.find(function (err, posts) {
        if (err) {
            //express error handling
            return next(err);
        }
        //json response of song posts
        res.json(posts);
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

//the song id param for url
router.param('song', function (req, res, next, id) {
    //query for the specific song post
    var query = Song.findById(id);
    query.exec(function (err, song) {
        if (err) {
            return next(err);
        }
        //if the song post doesn't exist
        if (!song) {
            return next(new Error('cannot find song post'));
        }
        req.song = song;
        return next();
    });
});

//comment param id for specific song post
router.param('comment', function (req, res, next, id) {
    //query for the specific comment
    var query = Comment.findById(id);
    query.exec(function (err, comment) {
        if (err) {
            return next(err);
        }
        //if the comment doesn't exist
        if (!comment) {
            return next(new Error('cannot find comment'));
        }
        req.comment = comment;
        return next();
    });
});


//getting single song post data
router.get('/songs/:song', function (req, res) {
    req.song.populate('comments', function (err, song) {
        if (err) {
            return next(err);
        }
        res.json(req.song);
    });
});

//upbeat song post
router.put('/songs/:song/upbeat', function (req, res, next) {
    req.song.upbeat(function (err, song) {
        if (err) {
            return next(err);
        }
        res.json(song);
    });
});

//downbeat song post
router.put('/songs/:song/downbeat', function (req, res, next) {
    req.song.downbeat(function (err, song) {
        if (err) {
            return next(err);
        }
        res.json(song);
    });
});

//add new comment to a certain song post
router.post('/songs/:song/comments', function (req, res, next) {

    var comment = new Comment(req.body);
    //set comment to the request
    comment.song = req.song;

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
router.put('/songs/:song/comments/:comment/upbeat', function (req, res, next) {
    req.comment.upbeat(function (err, comment) {
        if (err) {
            return next(err);
        }
        res.json(comment);
    });
});

//downbeat a specific comment on a specific song post
router.put('/songs/:song/comments/:comment/downbeat', function (req, res, next) {
    req.comment.downbeat(function (err, comment) {
        if (err) {
            return next(err);
        }
        res.json(comment);
    });
});

module.exports = router;