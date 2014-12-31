;(function () {
  'use strict';
  
  angular
    .module('core:ComposeController',[])
    .controller('ComposeController', ComposeController);

    function ComposeController($scope, $http, $q, $state, $rootScope){ // removed $state because of testing errors
      var vm = this;
      vm.user = {};

      vm.findCoordinates = findCoordinates;      
      vm.find = createUser;
      vm.getUser = getUser;

      // once user has hit submit, its a chain of events that get user info and populates lat/long before posting data to server
      function getUser (user) {
        //start animation
        createUser(user);
        findCoordinates(user.origin, "originCoordinates", function() { 
          return findCoordinates(user.destination, "destinationCoordinates", function() {
            return postData(vm.user);
          });
        });
      }


      // gets all form data from compose.html
      var createUser = function (user) {
        vm.user = angular.copy(user);
      }

      // returns an object with latitude and longitude
      function findCoordinates (place, waypoint, callback) {
        var baseURL = "http://nominatim.openstreetmap.org/search?format=json&limit=3&q=";
        return $http({
          method: "GET",
          url: baseURL+place
        }).success(function(data) {
          var place = data[0];  // returns multiple places. first object is the most accurate
          vm.user[waypoint] = [place.lat,place.lon];
          callback();
        })
      }

      // create usfer, then get origin, then get destination, then save lat,lon to user
      function postData (user) {
        vm.user = angular.copy(user);
        $rootScope.origin = vm.user.originCoordinates;
        console.log($rootScope.origin,$rootScope.origin[0]);
        $rootScope.destination = vm.user.destinationCoordinates; 

        var redirect = vm.user.title;

        $http({
          method: 'POST',
          url: '/' + redirect ,
          data: JSON.stringify({
            id: vm.user.id,
            origin: vm.user.originCoordinates,
            destination: vm.user.destinationCoordinates,
            type: 'create'
          })
        }).success(function (data) {
          $state.go(redirect)
        }).error(function(data, status){
          $state.go(redirect);
        });     
      };
  }
}).call(this);
    

