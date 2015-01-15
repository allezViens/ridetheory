(function () {
  'use strict';
  
  angular
    .module('app.route')
    .controller('RouteCtrl', RouteCtrl);

    /* ngInject */

    function RouteCtrl(GoogleFactory,RouteFactory,RouterboxFactory, $scope, $rootScope, $stateParams, $q, $timeout, $http){
      var vm = this;
      vm.route = [];
      vm.matches = RouteFactory.possibleMatches.matches;
      vm.waypoints = GoogleFactory.routeWaypoints;

      initialize();
      $rootScope.$on('tripUpdated',console.log('trip updated from ctrl'));

// waypoitn alias: "pass1"date: "2015-01-13T08:00:00.000Z"destination: Array[2]email: "pass1@gmail.com"origin: Array[2]


      function createRoute (tripData,waypoints,waypointOrder) {
        vm.route = [];

        RouterboxFactory.reverseGeocode(tripData.origin)
        .success(function (data) {
          // add Start
          vm.route.push({type: 'origin', alias: 'Start', address: data.results[0].formatted_address});             
          
          angular.forEach(waypointOrder,function(tuple,index){
            angular.forEach(waypoints,function(user){
              if (RouterboxFactory.compare(tuple,user.origin)) {
                  //determin order of tuples. 
                  RouterboxFactory.reverseGeocode(user.origin)
                  .success(function (data) {
                    $timeout(function () {
                      vm.route.push({type: 'origin', alias: user.alias, address: data.results[0].formatted_address});
                    }, index * 75);
                  })
                  .error(function () {
                    console.log('reverseGeocode error!');
                  });
              }

              if (RouterboxFactory.compare(tuple,user.destination)) {
                RouterboxFactory.reverseGeocode(user.destination)
                .success(function (data) {
                  $timeout(function () {
                    vm.route.push({type: 'destination', alias: user.alias, address: data.results[0].formatted_address});
                  }, index * 75);
                })
                .error(function () {
                  console.log('reverseGeocode error!');
                });
              }
          });
        });
          // add Waypoints if waypoints is given
          


          RouterboxFactory.reverseGeocode(tripData.destination)
          .success(function (data) {
            // add End
            $timeout(function() {
              vm.route.push({type: 'destination', alias: 'End', address: data.results[0].formatted_address});              
            }, 2000);
          });     
        });
      }

      function initialize(){
        RouteFactory.getTrip($stateParams.id)
        .then(function(){
          vm.trip = RouteFactory.tripData.driver || RouteFactory.tripData.passenger;
          vm.type = RouteFactory.tripData.driver ? 'driver' : 'passenger';
          RouteFactory.getMatches(vm.trip.origin,vm.trip.destination,vm.trip.date,'driver')
          .then(function(){
            vm.possibleMatches = RouteFactory.possibleMatches.matches;
            regenerateRoute();
          })
        });

        
      }



      function regenerateRoute() {
        GoogleFactory.setOrigin(vm.trip.origin);
        GoogleFactory.setDestin(vm.trip.destination);

        var mapWaypoints = [], routeBox = [];
        // for each object in the vm.trip.picks
        angular.forEach(vm.trip.picks,function(match){
          // if object.status === 'CONFIRMED' get request to object.id 
            angular.forEach(vm.possibleMatches,function(possible,index){
              if (possible.email === match.id){
                  //add to map
                mapWaypoints.push({
                  location: GoogleFactory.convertToLocation(possible.origin),
                  stopover:true
                });
                mapWaypoints.push({
                  location: GoogleFactory.convertToLocation(possible.destination),
                  stopover:true
                });
                vm.possibleMatches.splice(index,1);
                routeBox.push(possible);
              }
            });
        });
        GoogleFactory.drawRoute(vm.trip.origin,vm.trip.destination,mapWaypoints,function(data) {
          createRoute(vm.trip,routeBox,data);
        });
        angular.forEach(vm.possibleMatches,function(user){
          GoogleFactory.addUserMarker(user.origin,user.alias, user.email,true);
          GoogleFactory.addUserMarker(user.destination,user.alias, user.email,false);
        })
      }
  }
})();
    

