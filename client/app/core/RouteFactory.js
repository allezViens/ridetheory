(function() {

  angular
    .module('app.core')
    .factory('RouteFactory', RouteFactory);

  function RouteFactory($http){

    var RouteFactory = {
      userEmail: null,
      userType: null,  
      origin: null,
      destination: null,
      date: Date.now(),
      possibleMatches: [],
      selectedPassengers: [],
      setOrigin: setOrigin,
      setDestination: setDestination,
      getMatches: getMatches,
      createRoute: createRoute,
      getTrip: getTrip,
      addUser: addUser,
      removeOrigin: removeOrigin,
      removeDestination: removeDestination,
      reverseGeocode: reverseGeocode
    }

    return RouteFactory;

    function getTrip(token){
       var data = { token: token };
       return $http({
         method: 'GET',
         url: '/api/trip?',
         params: { token: token }
       }).success(function(data){
         RouteFactory.tripData = data;
       })
    }



    function setOrigin(coordinates){
      RouteFactory.origin = coordinates;
    }

    function removeOrigin(){
      origin = null;
    }

    function removeDestination(){
      destination = null;
    }

    function setDestination(coordinates){
      RouteFactory.destination = coordinates;
    }

    function addUser(user) {
      RouteFactory.selectedPassengers.push(user);
    }

    function createArrayOfWaypoints(){
      var waypoints = [];
      waypoints.push(RouteFactory.origin);
      waypoints.push(RouteFactory.destination);
      for(i=0; i < RouteFactory.selectedPassengers.length;i++){
        waypoints.push(RouteFactory.selectedPassengers[i].origin);
        waypoints.push(RouteFactory.selectedPassengers[i].destination);
      }
      return waypoints;
    }

    function getTrip(token){
      var data = { token: token };
      return $http({
        method: 'GET',
        url: '/api/trip?',
        params: { token: token }
      }).success(function(data){
        RouteFactory.tripData = data;
      })
    }

    function getMatches(origin,destination,date,type) {
      var trip = {
        oLat: origin[0], oLon: origin[1],
        dLat: destination[0], dLon: destination[1],
        date: date
      }
      return $http({
        url: 'api/passenger/matches',
        method: 'GET',
        params: trip
      })
      .success(function (data) {
        RouteFactory.possibleMatches = data;
      })
      .error(function() {
        console.log("searchRoute didn't return results");
      });
    }

    function createRoute(tripObject) {
      console.log(tripObject);
      return $http({
        method: 'POST',
        url: '/api/' + tripObject.type,
        data: JSON.stringify(tripObject)
      })
      .success(function (data) {
        console.log(data);
      })
      .error(function(error){
        console.log(error);
        console.log("could not create route");
      });     
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

    function updateRoute(tripObject) {
      /* {token: "h128ab", origin: [1.9,22.1], destination: [3.3,4.5], 
       * date: "", alias: "beth", email: "beth@gmail.com", type:”Passenger/Driver”}
       */
      return $http({
        method: 'POST',
        url: '/api/trip',
        data: JSON.stringify(tripObject)
      })
      .success(function (data) {
        // TODO show status success to user
        console.log(data);
      })
      .error(function(){
        console.log("could not update route");
      });     
    }
  }
})();



