(function () {
  'use strict';
  
  angular
    .module('app.search')
    .controller('Search', Search);

    /* ngInject */
    function Search($http, $state, userService){ 
      var vm = this;

      vm.findCoordinates = findCoordinates;      

      vm.submitUser = submitUser;

      // once user has hit submit, its a chain of events that get user info and populates lat/long before posting data to server
      function submitUser (user) {
        //start animation
        vm.user = angular.copy(user);
        findCoordinates(user.origin, "originCoordinates", function() { 
          return findCoordinates(user.destination, "destinationCoordinates", function() {
            return postData(vm.user);
          });
        });
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
        }).error(function(data){
          console.log(data);
        })
      }

      // create usfer, then get origin, then get destination, then save lat,lon to user
      function postData (user) {
        userService.setUser(user);

        var redirect = vm.user.title;

        $http({
          method: 'POST',
          url: '/' + redirect,
          data: JSON.stringify({
            id: vm.user.id,
            origin: vm.user.originCoordinates,
            destination: vm.user.destinationCoordinates,
            type: 'create'
          })
        }).success(function (data) {
          $state.go('Map')
        }).error(function(data, status){
          $state.go(redirect);
        });     
      };
  }
})();
    

