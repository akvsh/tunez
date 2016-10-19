//main app
//external modules (like ui-router) are added as a dependancy here
var app = angular.module('tunez', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function ($stateProvider, $urlRouterProvider) {
        // set up a home route (/home) with name,url,template url
        //also set a controller to control this state
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'mainCtrl'
            })

        //for each post
        .state('songs', {
            url: '/songs/{id}',
            templateUrl: '/songs.html',
            controller: 'songCtrl'
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
        songs: []
    }
    return o;
}]);

//creating a controller called mainController
//no persisten data (should be in model)
//controller should be 'thin' normally, main logic and data should be taken care of in service
app.controller('mainCtrl', [
    '$scope', //the app object ('this')
    '$stateParams', //object that stores info about URL
    'songs',
    //scope is an object that binds to DOM element where you apply controller
    //Think of it like C++ Object ctor with this.name, this.age etc.
    function ($scope, $stateParams, songs) {
        //any changes to $scope.songs now stored in service & available to other modules that inject 'songs' service
        //injecting: adding name of service to controller where we want to access it
        // ex. [$scope,songs <---INJECTION]
        $scope.songs = songs.songs[$stateParams.id];
        /*
        //list of computers
        $scope.songs = [
            {
                title: 'Fido - For My Dogs',
                upbeats: 3
            },
            {
                title: 'Nil - Plus one',
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
        ];
        */

        $scope.addSong = function () {

            //Check if user didn't submit title or submitted empty string, then alert them to enter title
            if (!$scope.title || $scope === '') {
                alert("Unable to submit tune. Please enter a song title!");
                return;
            }
            $scope.songs.push({
                //getting title from our app/object
                title: $scope.title,
                link: $scope.link,
                upbeats: 0
                comments: [
                    {
                        author: 'Joe',
                        body: 'Great song!',
                        upvotes: 0
                    },
                    {
                        author: 'Bob',
                        body: 'I love that beat!',
                        upvotes: 0
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