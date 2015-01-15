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
      vm.sendMessage = sendMessage;

      initialize();

// waypoitn alias: "pass1"date: "2015-01-13T08:00:00.000Z"destination: Array[2]email: "pass1@gmail.com"origin: Array[2]


      function createRoute (tripData,waypoints,waypointOrder) {
        vm.route = [];
        var alphabetCode = 65; // start at B

        RouterboxFactory.reverseGeocode(tripData.origin)
        .success(function (data) {
          // add Start
          vm.route.push({type: 'origin', alias: tripData.alias, waypointLabel: 'A', address: data.results[0].formatted_address});             
          
          angular.forEach(waypointOrder,function(tuple,index){

            angular.forEach(waypoints,function(user){
              
              // user origin
              if (RouterboxFactory.compare(tuple,user.origin)) {
                //determine order of tuples
                RouterboxFactory.reverseGeocode(user.origin)
                .success(function (data) {
                  $timeout(function () {
                    alphabetCode ++;
                    console.log('origin start',alphabetCode);
                    var alphabetOrigin = String.fromCharCode(alphabetCode);
                    vm.route.push({type: 'origin', alias: user.alias, waypointLabel: alphabetOrigin, address: data.results[0].formatted_address});
                    console.log('origin end',alphabetCode);
                  }, index * 75);

                })
                .error(function () {
                  console.log('reverseGeocode error!');
                });                
              }

              // user destination
              if (RouterboxFactory.compare(tuple,user.destination)) {
                RouterboxFactory.reverseGeocode(user.destination)
                .success(function (data) {
                  console.log('destination start',alphabetCode);
                  $timeout(function () {
                  alphabetCode++;
                  var alphabetDest = String.fromCharCode(alphabetCode);
                    vm.route.push({type: 'destination', alias: user.alias, waypointLabel: alphabetDest, address: data.results[0].formatted_address});
                    console.log('destination end',alphabetCode);
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
              alphabetCode++;
              var alphabetEnd = String.fromCharCode(alphabetCode);
              vm.route.push({type: 'destination', waypointLabel: alphabetEnd, alias: tripData.alias, address: data.results[0].formatted_address});              
            }, 2000);
          });     
        });
      }

      function initialize(){
        RouteFactory.getTrip($stateParams.id)
        .then(function(){
          vm.trip = RouteFactory.tripData.driver || RouteFactory.tripData.passenger;
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
          console.log(match);
          // if object.status === 'CONFIRMED' get request to object.id 
            angular.forEach(vm.possibleMatches,function(possible){
              console.log(possible);
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

                routeBox.push(possible);
              }
            });
        });

        GoogleFactory.drawRoute(vm.trip.origin,vm.trip.destination,mapWaypoints,function(data) {
          createRoute(vm.trip,routeBox,data);
        });

        angular.forEach(vm.possibleMatches,function(user){
          GoogleFactory.addUserMarker(user.origin,user.alias);
          GoogleFactory.addUserMarker(user.destination,user.alias);
        })
      }

      function sendMessage() {
        $http({
          method: 'POST',
          url: 'api/trip/picks',
          data: {
            token: $stateParams.id,
            email: 'pass3@gmail.com',
            pickType: 'add'
          }
        })
        .success(function(){
          initialize();
        });
      }
  }
})();
    

