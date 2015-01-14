(function () {
  'use strict';
  
  angular
    .module('app.route')
    .controller('RouteCtrl', RouteCtrl);

    /* ngInject */

    function RouteCtrl(GoogleFactory,RouteFactory,RouterboxFactory, $stateParams, $q, $timeout, $http){
      var vm = this;
      vm.route = [ ];
      vm.matches = RouteFactory.possibleMatches.matches;
      vm.waypoints = GoogleFactory.routeWaypoints;

      initialize();

      function createRoute (tripData,waypoints) {
        RouterboxFactory.reverseGeocode(tripData.origin)
        .success(function (data) {
          // add Start
          vm.route.push({type: 'origin', alias: 'Start', address: data.results[0].formatted_address});             
          // add Waypoints
          RouterboxFactory.route(waypoints,RouteFactory.possibleMatches,vm.route);

        }); 

        RouterboxFactory.reverseGeocode(tripData.destination)
        .success(function (data) {
          // add End
          $timeout(function() {
            vm.route.push({type: 'destination', alias: 'End', address: data.results[0].formatted_address});              
          }, 700);
        });     
      }

      function initialize(){
        RouteFactory.getTrip($stateParams.id)
        .then(function(){
          vm.trip = RouteFactory.tripData.driver || RouteFactory.tripData.passenger;
          RouteFactory.getMatches(vm.trip.origin,vm.trip.destination,vm.trip.date,'driver')
          .then(function(){
            vm.possibleMatches = RouteFactory.possibleMatches.matches;
            initMap();
          })
        });
      }


      function initMap() {
        GoogleFactory.setOrigin(vm.trip.origin);
        GoogleFactory.setDestin(vm.trip.destination);

        var waypoints = [];
        // for each object in the vm.trip.picks
        angular.forEach(vm.trip.picks,function(match){
          // if object.status === 'CONFIRMED' get request to object.id 
          if ( match.status === 'CONFIRMED') {
            angular.forEach(vm.possibleMatches,function(possible){
              console.log(possible);
              if (possible.email === match.id){
                waypoints.push({
                  location: GoogleFactory.convertToLocation(possible.origin),
                  stopover:true
                });
                waypoints.push({
                  location: GoogleFactory.convertToLocation(possible.destination),
                  stopover:true
                });
              }
            });
          }
        });
        GoogleFactory.drawRoute(vm.trip.origin,vm.trip.destination,waypoints,function(data) {
          createRoute(RouteFactory.tripData.driver,data);
        });
        angular.forEach(vm.possibleMatches,function(user){
          GoogleFactory.addUserMarker(user.origin,user.alias);
          GoogleFactory.addUserMarker(user.destination,user.alias);
        })
        vm.trip = RouteFactory.tripData.driver || RouteFactory.tripData.passenger; 
        createRoute(vm.trip);
      }
  }
})();
    

