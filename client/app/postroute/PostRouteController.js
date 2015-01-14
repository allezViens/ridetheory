(function () {
  'use strict';
  
  angular
    .module('app.postroute')
    .controller('PostRouteCtrl', PostRouteCtrl);

    /* ngInject */
    function PostRouteCtrl($http, $state, RouteFactory, GoogleFactory, $scope){ 
      var vm = this;

      vm.searchRoute = searchRoute;
      vm.createRoute = createRoute;
      vm.removeDestination = removeDestination;
      vm.removeOrigin = removeOrigin;


      $scope.$watch('vm.trip.origin',function(collection){
        if (collection){
          var coordinates = [collection.geometry.location.k,collection.geometry.location.D];
          GoogleFactory.setOrigin(coordinates);
          if(vm.trip.origin && vm.trip.destination){
            GoogleFactory.drawRoute([vm.trip.origin.geometry.location.k,vm.trip.origin.geometry.location.D],[vm.trip.destination.geometry.location.k,vm.trip.destination.geometry.location.D]);
          }
        }
      },false);

      $scope.$watch('vm.trip.destination',function(collection){
        if (collection){
          var coordinates = [collection.geometry.location.k,collection.geometry.location.D];
          GoogleFactory.setDestin(coordinates);
          if(vm.trip.origin && vm.trip.destination){
            GoogleFactory.drawRoute([vm.trip.origin.geometry.location.k,vm.trip.origin.geometry.location.D],[vm.trip.destination.geometry.location.k,vm.trip.destination.geometry.location.D]);
          }
        }
      },false);

      function removeDestination(){
        GoogleFactory.removeDestination()
      }

      function removeOrigin(){
        GoogleFactory.removeOrigin();
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
        obj.origin = [vm.trip.origin.geometry.location.k,vm.trip.origin.geometry.location.D];
        obj.destination = [vm.trip.destination.geometry.location.k,vm.trip.destination.geometry.location.D];
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
    

