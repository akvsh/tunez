//main app
//external modules (like ui-router) are added as a dependancy here
var app = angular.module('tunez', ['ui.router']);

app.config([
'$stateProvider', //refers to place in app (in terms of UI/navigation)
'$urlRouterProvider',
function ($stateProvider, $urlRouterProvider) {
        // set up a home route (/home) with name,url,template url
        //also set a controller to control this state

        //home page with all the posts      
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html', //inserted into ui-view when this state is active
                controller: 'mainCtrl',
                resolve: { // custom state data
                    //query backend for all songs everytime we enter home state
                    postPromise: ['songs', function (songs) {
                        return songs.getAll();
                    }]
                }
            })

        //for each post
        .state('songs', {
            url: '/songs/{id}', //songs + url parameter (id) for each id
            templateUrl: '/songs.html', //inserted into ui-view when this state is active
            controller: 'songsCtrl',
            resolve: {
                //query for song post with the requested id everytime we enter the /songs/id state
                song: ['$stateParams', 'songs', function ($stateParams, songs) {
                    return songs.get($stateParams.id);
                }]
            }
        });

        //got to home template if you receive undefined url
        $urlRouterProvider.otherwise('home');

}]);

// service (declared similarly to controllers). Both service/factory are instances of a provider
//Factory: create object -> add properties -> return object
//Service: instance of object (use 'new') -> add properties to this -> return this
//Provider: only service you can pass to .config() function
//TLDR: Very subtle differences between the three
//made because usually the controller goes out of scope and data cannot be accessed from other directives or controllers
app.factory('songs', ['$http', function ($http) {
    //create object which has song posts array. Object(o) is returned and now exposed to other Angular modules
    var o = {
        songs: []
    };

    o.getAll = function () {
        //GET request to /songs and then run function after request is successfully returned
        return $http.get('/songs').success(function (data) {
            //deep copy song posts to our o.songs array and updates UI
            angular.copy(data, o.songs);
        });
    };

    //when creating new song post, send a put request and after succes add to our songs array
    o.create = function (song) {
        return $http.post('/songs', song).success(function (data) {
            o.songs.push(data);
        });
    };

    //request for upbeating a song post and after success increment song upbeats in view
    o.upbeat = function (song) {
        return $http.put('/songs/' + song._id + '/upbeat').success(function (data) {
            song.upbeats += 1;
        });
    };

    //request for downbeating a song post and after success decrement song upbeats in view
    o.downbeat = function (song) {
        return $http.put('/songs/' + song._id + '/downbeat').success(function (data) {
            song.upbeats -= 1;
        });
    };

    o.get = function (id) {
        //get single song post from server (async, the data returned once request is complete)
        return $http.get('/songs/' + id).then(function (res) {
            return res.data;
        });
    };

    //add new comment to song post
    o.addComment = function (id, comment) {
        return $http.post('/songs/' + id + '/comments', comment);
    };

    o.upbeatComment = function (song, comment) {
        return $http.put('/songs/' + song._id + '/comments/' + comment._id + '/upbeat').success(function (data) {
            comment.upbeats += 1;
        });
    };

    o.downbeatComment = function (song, comment) {
        return $http.put('/songs/' + song._id + '/comments/' + comment._id + '/downbeat').success(function (data) {
            comment.upbeats -= 1;
        });
    };

    return o;
}]);

//creating a controller called mainController
//no persisten data (should be in model)
//controller should be 'thin' normally, main logic and data should be taken care of in service
app.controller('mainCtrl', [
    '$scope', //the app object ('this')
    'songs',
    //scope is an object that binds to DOM element where you apply controller
    //Think of it like C++ Object ctor with this.name, this.age etc.
    function ($scope, songs) {
        //any changes to $scope.songs now stored in service & available to other modules that inject 'songs' service
        //injecting: adding name of service to controller where we want to access it. ex. [$scope,songs <---INJECTION]
        $scope.songs = songs.songs;


        $scope.addSong = function () {
            //Check if user didn't submit title or submitted empty string, then alert them to enter title
            if (!$scope.title || $scope.title === '') {
                alert("Unable to submit tune. Please enter a song title!");
                return;
            }

            //add new song post
            songs.create({
                title: $scope.title,
                link: $scope.link, //TODO: check for valid link submissions
                upbeats: 0
            });

            //clear name and link after
            $scope.title = "";
            $scope.link = "";
        };

        //upbeat song post
        $scope.upbeat = function (song) {
            songs.upbeat(song);
        };

        //downbeat song post
        $scope.downbeat = function (song) {
            songs.downbeat(song);
        };
}]);

app.controller('songsCtrl', [
    '$scope', //the app object ('this')
    'songs',
    'song',
    function ($scope, songs, song) {
        $scope.song = song;
        console.log($scope.song);
        $scope.addComment = function () {

            if (!$scope.body || $scope.body === '') {
                alert("Don't talk much do ya? No comment was posted, please try again.");
                return;
            }

            songs.addComment(song._id, {
                body: $scope.body,
                author: 'user', //anon user for now, add auth l8r
            }).success(function (comment) {
                console.log(comment);
                $scope.song.comments.push(comment);
            });

            $scope.body = ''; //clear the body after
        };

        //upbeat given comment
        $scope.upbeat = function (comment) {
            songs.upbeatComment(song, comment);
        };

        //downbeat given comment
        $scope.downbeat = function (comment) {
            songs.downbeatComment(song, comment);
        };

}]);