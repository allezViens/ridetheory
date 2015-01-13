(function () {
  'use strict';
  
  angular
    .module('app.route')
    .controller('RouteCtrl', RouteCtrl);

    /* ngInject */

    function RouteCtrl(GoogleFactory,RouteFactory,$stateParams){
      var vm = this;
      vm.user = tripData;
      vm.user.role = tripData.role;
      vm.route = [ ];
      vm.user.origin = vm.user.driver.origin || vm.user.passenger.origin;
      vm.user.destination = vm.user.driver.destination || vm.user.passenger.destination;

      // Dummy data - get real data from Thomas
      // passenger matches
      var matches = [
        {origin: [37.8044557, -122.2713563], destination: [37.3438502,-121.8831349], alias: 'Jonathan', email: 'Jonathan@gmail.com'},
        {origin: [37.5482697, -121.9885719], destination: [37.431359,-121.885252153599], alias: 'Thomas', email: 'Thomas@gmail.com'},
      ];

      // Dummy data - get real data from Thomas
      // array of ordered waypoints
      var waypoints = [{ coords: [37.5482697, -121.9885719], email: 'Jonathan@gmail.com'},[37.8044557, -122.2713563],[37.431359,-121.885252153599],[37.3438502,-121.8831349]];

      // takes an array of waypoints and returns a new array of objects
      // used to generate data for route graphic display
      // { type: origin/destination tuple, alias: name}
      function route (waypoints, matches) {
        // convert origin to address
        var deferred = $q.defer();

        function compare (tupleA, tupleB) {
          return (tupleA[0] === tupleB[0] && tupleA[1] === tupleB[1]) ? true : false;
        }

        waypoints.forEach(function (waypoint, index, cb) {
          matches.forEach(function (user) {
            if (compare(waypoint, user.origin)) {
              RouteFactory.reverseGeocode(user.origin)
                .success(function (data) {
                  var address = data.results[0].formatted_address;
                  $timeout(function () {
                    vm.route.push({type: 'origin', alias: user.alias, address: address});
                  }, index * 75);
                })
                .error(function () {
                  console.log('reverseGeocode error!');
                });
            } else if (compare(waypoint, user.destination)) {
              RouteFactory.reverseGeocode(user.destination)
                .success(function (data) {
                  var address = data.results[0].formatted_address;
                  $timeout(function () {
                    vm.route.push({type: 'destination', alias: user.alias, address: address});
                  }, index * 75);
                })
                .error(function () {
                  console.log('reverseGeocode error!');
                });
            }
          });
        });

        deferred.resolve();
        return deferred.promise;
      }

      // remove person from route display
      vm.remove = function (user) {
        // remove by alias
        for (var i = vm.route.length - 1; i >= 0; i--) {
          if (user.alias === vm.route[i].alias) {
            vm.route.splice(i,1);
          }
        }
      }

      function createRoute () {
        // start
        RouteFactory.reverseGeocode(vm.user.origin).success(function (data) {
          vm.route.push({type: 'origin', alias: 'Start', address: data.results[0].formatted_address});    
          
          route(waypoints, matches)
          .then(function() { 
              $timeout(function () {
                vm.route.push({type: 'destination', alias: 'End', address: data.results[0].formatted_address});
              }, 700);
          });
        });      
      }

      function initialize(){
        // GoogleFactory.setOrigin(vm.origin);
        // GoogleFactory.setDestin(vm.destination);
        // GoogleFactory.drawRoute(vm.origin, vm.destination);
        createRoute();
      }
      initialize();
  }
})();
    

