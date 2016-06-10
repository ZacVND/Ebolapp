// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
    .state ('menu', {
      url: '/menu',
      abstract: true,
      templateUrl: 'templates/menu.html'  
    })
    .state('menu.map', {
      url: '/map',
      views: {
        'menuContent' : {
          templateUrl: 'templates/maps.html',
          controller: 'MapsCtrl'
        }
      } 
    })
    .state ('menu.Ebola', {
      url: '/Ebola',
      views: {
        'menuContent' : {
          templateUrl: 'templates/Ebola.html'
        }
      }
    })
    .state ('menu.situation', {
      url: '/situation',
      views: {
        'menuContent' : {
          templateUrl: 'templates/situation.html'
        }
      }
    })
    .state ('menu.help', {
      url: '/help',
      views: {
        'menuContent' : {
          templateUrl: 'templates/Help.html'
        }
      }
    });

  $urlRouterProvider.otherwise("menu/map");
})

.controller('MapsCtrl', function($scope, $state, $cordovaGeolocation, $ionicSideMenuDelegate){
  var options = {timeout: 10000, enableHighAccuracy: true};
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();  // Toggle the side menu
  }

  window.localStorage['isAlert'] = false;
  console.log(window.localStorage['isAlert']);

 
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };


 
    $scope.map = new google.maps.Map(document.getElementById("maps"), mapOptions);

    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

      var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
      });

      var aMessage = 'Area unsafe! </br> Avoid if possible, proceed with caution.';
      var sMessage = 'Area is safe.';

      var infoWindow = new google.maps.InfoWindow({
        content: sMessage
      });
     
      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      });

      var circle = new google.maps.Circle({
        center: latLng,
        radius: 100,
        strokeColor : '#AA00FF',
        strokeWidth: 5,
        fillColor : '#880000',
      });

      var liberiaCir = new google.maps.Circle({
        center: {lat: 6.319627, lng:  -9.733549},
        radius: 100100,
        strokeColor : '#AA00FF',
        strokeWidth: 5,
        fillColor : '#880000',
        map: $scope.map
      });

      $scope.alert = function() {
        window.localStorage['isAlert'] = true;
        console.log(window.localStorage['isAlert']);
        infoWindow = new google.maps.InfoWindow({
            content: aMessage
          });
         
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open($scope.map, marker);
        });
        circle.setMap($scope.map);
      };

      $scope.safe = function() {
        window.localStorage['isAlert'] = false;
        console.log(window.localStorage['isAlert']);
        infoWindow = new google.maps.InfoWindow({
            content: sMessage
          });
         
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open($scope.map, marker);
        });
        circle.setMap(null);
      };
     
    });

 
  }, function(error){
    console.log("Could not get location");
  });
});