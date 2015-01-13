(function () {
  'use strict';
  
  angular
    .module('app.postroute')
    .controller('PostRouteCtrl', PostRouteCtrl);

    /* ngInject */
    function PostRouteCtrl($http, $state, RouteFactory, GoogleFactory){ 
      var vm = this;

      vm.setOrigin = setOrigin;
      vm.setDestination = setDestination;
      vm.searchRoute = searchRoute;
      vm.createRoute = createRoute;
      vm.removeDestination = removeDestination;
      vm.removeOrigin = removeOrigin;

      function setOrigin(coordinates) {
        if (place){
          RouteFactory.setOrigin(place)
          .then(function(){
            vm.originLatLon = RouteFactory.origin;
            GoogleFactory.setOrigin(vm.originLatLon);
            if(RouteFactory.origin && RouteFactory.destination){
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
           if(RouteFactory.origin && RouteFactory.destination){
            GoogleFactory.drawRoute(vm.originLatLon,vm.destinationLatLon);
           }
         }) 
        }
      }

      function removeDestination(){
        RouteFactory.removeDestination();
        GoogleFactory.removeDestination()
        vm.destination = vm.destinationLatLon = null;
      }

      function removeOrigin(){
        RouteFactory.removeOrigin();
        GoogleFactory.removeOrigin();
        vm.origin = vm.originLatLon = null;
      }

      function createRoute(trip){
        vm.trip = updateModel(trip);
        console.log(vm.trip);
        RouteFactory
        .createRoute(vm.trip)
        .then(function(){
          window.location.href="/confirm.html";
        })
      }

      function updateModel(trip){
        var obj = angular.copy(trip);
        obj.origin = [trip.origin.geometry.location.k,trip.origin.geometry.location.D];
        obj.destination = [trip.destination.geometry.location.k,trip.destination.geometry.location.D];
        obj.date = trip.date.toISOString();
        return obj;
      }

      // Rewrites origin and destination with actual lat/lon
      function searchRoute(trip) {
        RouteFactory
          .searchRoute()
          .then(function(data) {
            console.log(data);
        });
      }

  }
})();
    

