(function () {
  'use strict';
  
  angular
    .module('app.postroute')
    .controller('PostRouteCtrl', PostRouteCtrl);

    /* ngInject */
    function PostRouteCtrl($http, $state, RouteFactory, GoogleFactory, $scope){ 
      var vm = this;

      vm.createRoute = createRoute;
      vm.removeDestination = removeDestination;
      vm.removeOrigin = removeOrigin;

      var picker = new Pikaday({
        field: document.getElementById('datepicker'),
        firstDay: 1,
        minDate: new Date(),
        maxDate: new Date('2020-12-31'),
        yearRange: [2015, 2020],
        bound: false,
        setDefaultDate: true,
        container: document.getElementsByClassName('date')[0]
      });

      $scope.$watch('vm.trip.origin',function(collection){
        if (collection && collection.geometry){
          console.log(collection);
          var coordinates = [collection.geometry.location.k,collection.geometry.location.D];
          GoogleFactory.setOrigin(coordinates);
          if(vm.trip.origin && vm.trip.destination){
            GoogleFactory.drawRoute([vm.trip.origin.geometry.location.k,vm.trip.origin.geometry.location.D],[vm.trip.destination.geometry.location.k,vm.trip.destination.geometry.location.D]);
          }
        }
      },false);

      $scope.$watch('vm.trip.destination',function(collection){
        if (collection && collection.geometry){
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
        var newTrip = updateModel(trip);
        RouteFactory
        .createRoute(newTrip)
        .then(function(){
          window.location.href="/confirm.html";
        })
      }

      function updateModel(trip){
        var obj = angular.copy(trip);
        obj.type = trip.type ? trip.type : 'driver';
        obj.origin = [trip.origin.geometry.location.k,trip.origin.geometry.location.D];
        obj.destination = [trip.destination.geometry.location.k,trip.destination.geometry.location.D];
        obj.date = obj.date ? new Date(obj.date).toISOString() : new Date().toISOString();
        return obj;
      }
  }
})();
    

