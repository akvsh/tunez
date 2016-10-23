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
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: '/home.html', //inserted into ui-view when this state is active
            controller: 'mainCtrl'
        })

        //for each post
        .state('songs', {
            url: '/songs/{id}', //songs + url parameter (id) for each id
            templateUrl: '/songs.html', //inserted into ui-view when this state is active
            controller: 'songsCtrl'
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
app.factory('songs', [function () {
    //create object which has song posts array. Object(o) is returned and now exposed to other Angular modules
    var o = {
        songs: [
            {
                title: 'Tame Impala - LoveParanoia',
                upbeats: 3
            },
            {
                title: 'Nirvana - Smells Like Teenage Spirit',
                upbeats: 0
            },
            {
                title: 'Drake - Model Views Controlla',
                upbeats: 6
            },
            {
                title: 'The Weeknd - The Hills',
                upbeats: 5
            },
            {
                title: 'Vitas - Opera',
                upbeats: 17
            }
        ]
    }
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

            $scope.songs.push({
                //getting title from our app/object
                title: $scope.title,
                link: $scope.link,
                upbeats: 0,
                comments: [
                    {
                        author: 'Joe',
                        body: 'Great song!',
                        upbeats: 0
                    },
                    {
                        author: 'Bob',
                        body: 'I love that beat!',
                        upbeats: 0
                    }
                ]
            });
            //clear name and link after
            $scope.title = "";
            $scope.link = "";
        };

        $scope.addUpbeat = function (tune) {
            tune.upbeats++;
        };
}]);

app.controller('songsCtrl', [
    '$scope', //the app object ('this')
    '$stateParams', //object that stores info about URL
    'songs',
    function ($scope, $stateParams, songs) {
        //index is post id FOR NOW
        // we use the stateparam from the url (/:id) to get the id
        $scope.songs = songs.songs[$stateParams.id];

        $scope.addComment = function () {
            if (!$scope.body || $scope.body === '') {
                alert("Don't talk much do ya? No comment was posted, please try again.");
                return;
            }

            $scope.song.comments.push({
                body: $scope.body,
                author: 'user', //anon user for now, should later be logged in user from db
                upbeats: 0
            });

            $scope.body = ''; //clear the body after
        };

        $scope.addUpbeat = function (comment) {
            comment.upbeats++;
        };

}]);