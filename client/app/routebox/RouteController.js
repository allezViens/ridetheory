(function () {
  'use strict';
  
  angular
    .module('app.route')
    .controller('RouteCtrl', RouteCtrl);

    /* ngInject */
    function RouteCtrl(GoogleFactory,RouteFactory,$stateParams){
      var vm = this;

      vm.initMap = initMap;

      initialize();

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
      };

      function initMap() {
        GoogleFactory.setOrigin(vm.trip.origin);
        GoogleFactory.setDestin(vm.trip.destination);
        GoogleFactory.drawRoute(vm.trip.origin, vm.trip.destination); 
        angular.forEach(vm.possibleMatches,function(user){
          GoogleFactory.addUserMarker(user.origin,user.alias);
          GoogleFactory.addUserMarker(user.destination,user.alias);
        })
      }
  }
})();
    

