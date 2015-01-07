(function () {
  'use strict';
  
  angular
    .module('app.search')
    .controller('Search', Search);

    /* ngInject */
    function Search($http, $state, RouteFactory, GoogleFactory){ 
      var vm = this;

      vm.setOrigin = setOrigin;
      vm.setDestination = setDestination;
      vm.searchRoute = searchRoute;
      vm.postRoute = postRoute;
      vm.removeDestination = removeDestination;
      vm.removeOrigin = removeOrigin;

      function setOrigin(place) {
        if (place){
          RouteFactory.setOrigin(place)
          .then(function(){
            vm.originLatLon = RouteFactory.origin;
            GoogleFactory.setOrigin(vm.originLatLon);
            if(RouteFactory.destination){
             GoogleFactory.drawRoute(vm.originLatLon,vm.destinationLatLon);
            }
          });
        }
      }

      function setDestination(place) {
        if (place) {
         RouteFactory.setDestination(place)
         .then(function(){
           vm.destinationLatLon = RouteFactory.destination;
           GoogleFactory.setDestin(vm.destinationLatLon);
           if(RouteFactory.origin){
            GoogleFactory.drawRoute(vm.originLatLon,vm.destinationLatLon);
           }
         }) 
        }
      }

      function removeDestination(){
        console.log('removeDestination');
        RouteFactory.removeDestination();
        GoogleFactory.removeDestination()
        vm.destination = vm.destinationLatLon = null;
      }

      function removeOrigin(){
        RouteFactory.removeOrigin();
        GoogleFactory.removeOrigin();
        vm.origin = vm.originLatLon = null;
      }

      function postRoute(trip){
        vm.trip = updateModel(trip);
        RouteFactory
        .saveRoute(vm.trip)
        .then(function(){
          $location.href = "/email";
        })
      }

      function updateModel(trip){
        var obj = angular.copy(trip);
        obj.origin = vm.originLatLon,
        obj.destination = vm.destinationLatLon;
        obj.date = trip.date.toISOString();
        return obj;
      }

      // Rewrites origin and destination with actual lat/lon
      function searchRoute(trip) {
        console.log('search');
        vm.trip = updateModel(trip);
        GoogleFactory.setOriginDestination(vm.originLatLon,vm.destinationLatLon);
        RouteFactory
          .searchRoute(vm.trip)
          .then(function(data) {
            vm.allUsers = RouteFactory.possiblePassengers;
            GoogleFactory.addMarkers(vm.allUsers);
            GoogleFactory.getRoute(vm.originLatLon,vm.destinationLatLon);
        });
      }

  }
})();
    

