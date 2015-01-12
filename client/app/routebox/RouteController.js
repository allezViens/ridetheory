(function () {
  'use strict';
  
  angular
    .module('app.route')
    .controller('RouteCtrl', RouteCtrl);

    /* ngInject */
    function RouteCtrl(tripData, GoogleFactory, RouteFactory, $timeout){
      var vm = this;
      vm.user = tripData;
      vm.user.role = tripData.role;
      vm.route = [ ];

      // Dummy data - get real data from Thomas
      // passenger matches
      var matches = [
        {origin: [37.8044557, -122.2713563], destination: [37.3438502,-121.8831349], alias: 'alex', email: 'alex@gmail.com'},
        {origin: [37.5482697, -121.9885719], destination: [37.431359,-121.885252153599], alias: 'bob', email: 'bob@gmail.com'},
      ];

      // Dummy data - get real data from Thomas
      // array of ordered waypoints, incl. origin and destination
      var waypoints = [[37.5482697, -121.9885719],[37.8044557, -122.2713563],[37.431359,-121.885252153599],[37.3438502,-121.8831349]];


      // takes an array of waypoints and returns a new array of objects
      // used to generate data for route graphic display
      // { type: origin/destination tuple, alias: name}
      function route (waypoints, matches) {
        
        function compare (tupleA, tupleB) {
          return (tupleA[0] === tupleB[0] && tupleA[1] === tupleB[1]) ? true : false;
        }

        waypoints.forEach(function (waypoint, index) {
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
 
      function initialize(){
        // GoogleFactory.setOrigin(vm.origin);
        // GoogleFactory.setDestin(vm.destination);
        // GoogleFactory.drawRoute(vm.origin, vm.destination);
        route(waypoints, matches);
      }

      initialize();
  }
})();
    

