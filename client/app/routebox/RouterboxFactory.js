(function() {

  angular
    .module('app.core')
    .factory('RouterboxFactory', RouterboxFactory);

  function RouterboxFactory($http, $q,$timeout){

    var RouterboxFactory = {
      compare: compare,
      geocode: geocode,
      reverseGeocode: reverseGeocode,
    };

    return RouterboxFactory;
    
    function compare (tupleA, tupleB) {
      return (tupleA[0] === tupleB[0] && tupleA[1] === tupleB[1]);
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

    function geocode (address) {
      var baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
      var key = "AIzaSyCGv1yOax6sOABKLyT6r9Fu5khXoTPlDfs";
      var url = baseURL + address + '&key=' + key;
      return $http({
        method: 'GET',
        url: url
      });      
    } 
  }
})();



