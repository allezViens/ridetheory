(function () {
  'use strict';
  
  angular
    .module('app.route')
    .controller('RouteCtrl', RouteCtrl);

    /* ngInject */

    function RouteCtrl(GoogleFactory,RouteFactory,RouterboxFactory, $stateParams, $q, $timeout){
      var vm = this;
      vm.route = [ ];
      vm.matches = RouteFactory.possibleMatches.matches;
      vm.waypoints = GoogleFactory.routeWaypoints;

      function createRoute (tripData) {
        RouterboxFactory.reverseGeocode(tripData.origin)
        .success(function (data) {
          // add Start
          vm.route.push({type: 'origin', alias: 'Start', address: data.results[0].formatted_address});             
          
          // add Waypoints
          RouterboxFactory.route(vm.routeWaypoints, RouteFactory.possibleMatches)
          .success(function () {
            RouterboxFactory.reverseGeocode(tripData.destination)
            .success(function (data) {
              // add End
              $timeout(function() {
                vm.route.push({type: 'destination', alias: 'End', address: data.results[0].formatted_address});              
              }, 700);
            });
          });
        });      
      }

      function initialize(){
        RouteFactory.getTrip($stateParams.id)
        .then(function(){
          vm.trip = RouteFactory.tripData.driver || RouteFactory.tripData.passenger; 
          createRoute(vm.trip);
        });
      }

      initialize();

      // remove person from route display
      // vm.remove = function (user) {
      //   // remove by alias
      //   for (var i = vm.route.length - 1; i >= 0; i--) {
      //     if (user.alias === vm.route[i].alias) {
      //       vm.route.splice(i,1);
      //     }
      //   }
      // }
  }
})();
    

