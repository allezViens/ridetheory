(function() {

  angular
    .module('app.core')
    .factory('RouteFactory', RouteFactory);

  function RouteFactory($http){

    var RouteFactory = {
      origin: null,
      destination: null,
      date: Date.now(),
      possiblePassengers: [],
      addedPassengers: [],
      setOrigin: setOrigin,
      setDestination: setDestination,
      getLatLon: getLatLon,
      searchRoute: searchRoute,
      saveRoute: saveRoute,
      addUser: addUser,
      removeOrigin: removeOrigin,
      removeDestination: removeDestination
    }

    return RouteFactory;

    function setOrigin(place){
      return getLatLon(place,function(coordinates){
        RouteFactory.origin = coordinates;
      });
    }

    function removeOrigin(){
      origin = null;
    }

    function removeDestination(){
      destination = null;
    }

    function setDestination(place){
      return getLatLon(place,function(coordinates){
        RouteFactory.destination = coordinates;
      })
    }

    function addUser(user) {
      RouteFactory.addedPassengers.push(user);
    }

    function createArrayOfWaypoints(){
      var waypoints = [];
      waypoints.push(RouteFactory.origin);
      waypoints.push(RouteFactory.destination);
      for(i=0; i < RouteFactory.addedPassengers.length;i++){
        waypoints.push(RouteFactory.addedPassengers[i].origin);
        waypoints.push(RouteFactory.addedPassengers[i].destination);
      }
      return waypoints;
    }

    // returns an object with latitude and longitude
    function getLatLon(place,callback) {
      return $http({
        method: "GET",
        url: "http://nominatim.openstreetmap.org/search?format=json&limit=3&q="+place
      }).success(function(data) {
        callback([data[0].lat,data[0].lon]); // returns multiple places. first object is the most accurate
      }).error(function(){
        console.log("getLatLon error");
      });
    }

    function searchRoute(tripObject) {
      return $http({
        url: '/' + tripObject.role,
        method: "GET",
        params: {
          oLat: tripObject.origin[0], oLon: tripObject.origin[1],
          dLat: tripObject.destination[0], dLon: tripObject.destination[1],
          date: tripObject.date
         }
      })
      .success(function (data) {
        RouteFactory.possiblePassengers = data.matches;
      })
      .error(function() {
        console.log("searchRoute didn't return results");
      });
    }

    function saveRoute(tripObject) {
      var endpoint = '/' + tripObject.role;
      tripObject.type = 'create';
      return $http({
        method: 'POST',
        url: '/' + tripObject.role,
        data: JSON.stringify(tripObject)
      })
      .success(function (data) {
        console.log(data);
      })
      .error(function(){
        console.log("could not postRoute");
      });     
    }



  }
})();



