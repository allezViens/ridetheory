(function() {

  angular
    .module('app.core')
    .factory('RouterboxFactory', RouterboxFactory);

  function RouterboxFactory($http, $q){

    var RouterboxFactory = {
      reverseGeocode: reverseGeocode,
      route: route
    }

    return RouterboxFactory;

      function compare (tupleA, tupleB) {
        return (tupleA[0] === tupleB[0] && tupleA[1] === tupleB[1]) ? true : false;
      }

      // Dummy data
      // var matches = [
      //   {origin: [37.8044557, -122.2713563], destination: [37.3438502,-121.8831349], alias: 'Jonathan', email: 'Jonathan@gmail.com'},
      //   {origin: [37.5482697, -121.9885719], destination: [37.431359,-121.885252153599], alias: 'Thomas', email: 'Thomas@gmail.com'},
      // ];
      // var waypoints = [[37.5482697, -121.9885719],[37.8044557, -122.2713563],[37.431359,-121.885252153599],[37.3438502,-121.8831349]];      
      
      // takes an array of waypoints and returns a new array of objects
      // used to generate data for route graphic display
      // { type: origin/destination tuple, alias: name}
      function route (waypoints, matches, route) {
        // convert origin to address
        var deferred = $q.defer();

        waypoints.forEach(function (waypoint, index, cb) {
          matches.forEach(function (user) {
            if (compare(waypoint, user.origin) && user.status === "confirmed") {
              RouterboxFactory.reverseGeocode(user.origin)
                .success(function (data) {
                  $timeout(function () {
                    route.push({type: 'origin', alias: user.alias, address: data.results[0].formatted_address});
                  }, index * 75);
                })
                .error(function () {
                  console.log('reverseGeocode error!');
                });
            } else if (compare(waypoint, user.destination) && user.status === "confirmed") {
              RouterboxFactory.reverseGeocode(user.destination)
                .success(function (data) {
                  $timeout(function () {
                    route.push({type: 'destination', alias: user.alias, address: data.results[0].formatted_address});
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

    // returns an object with latitude and longitude
    function reverseGeocode(coordinates) {
      var baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
      var key = "AIzaSyCGv1yOax6sOABKLyT6r9Fu5khXoTPlDfs";
      var url = baseURL + coordinates[0] + ',' + coordinates[1] + '&key=' + key;
      return $http({
        method: 'GET',
        url: url
      });
    }    

  }
})();



