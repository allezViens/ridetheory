angular
  .module('SearchController',[])
  .controller('SearchController', ['$scope', '$http', function ($scope, $http) {
    
  $scope.passengers = [];
    
  $scope.getData = function () {
    return $http({
      method: 'GET',
      url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=37.43143895,-121.885265953734&sensor=true_or_false&key=AIzaSyDb7R_MQT2cX6vHsbFRoweKMiM9KvocxWM",
    }).success(function (data) { 
      // google returns array with one object
      var results = data.results
      angular.forEach(results, function (object) {
        var formattedAddress = object.formatted_address;
        var coords = object.geometry.location;  // lat/lng object

        $scope.passengers.push({
          formattedAddress: formattedAddress,
          coords: coords
        })
      })
    });
  };

  }])