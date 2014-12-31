;(function () {
  'use strict'

  angular
    .module('core:PassengerController',['ngFx'])
    .controller('PassengerController', PassengerController);

    function PassengerController ($scope, $http, $state, $q, $timeout, $rootScope) {
      

      var passenger = this;
      passenger.drivers = [];
      var drivers = [];
      passenger.findDrivers = findDrivers;

      //set some timeout to push to passenger.drivers array
      var push = function (data, array) {
        return function () {
          array.push(data);
        }
      }


      // http://127.0.0.1:5000/driver?oLat=39.52927&oLong=-119.8136744&dLat=37.7792768&dLong=-122.4192704
      // returns an object with latitude and longitude
      var findDrivers = function() {
        $http({
          method: 'GET',
          url: '/driver',
          params: {
            oLat: $rootScope.origin[0],
            oLong: $rootScope.origin[1],
            dLat: $rootScope.destination[0],
            dLong: $rootScope.destination[1]
          }
        }).success(function(data) {
          passenger.drivers = data.matches;
        }).error(function(data) {
          console.log("Data corrupts");
        })
      }

      findDrivers();
      passenger.getDrivers = function (array) {
        array.forEach(function (item, index) {
          $timeout(push(item,passenger.drivers), index * 50);
        })
        return passenger.drivers;
      };

    }
}).call(this);