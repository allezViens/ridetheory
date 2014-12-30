;(function () {
  'use strict'

  angular
    .module('core:PassengerController',['ngFx'])
    .controller('PassengerController', PassengerController);

    function PassengerController ($scope, $http, $state, $q, $timeout) {
      var passenger = this;
      passenger.drivers = [];
      var drivers = [];


      //set some timeout to push to passenger.drivers array
      var push = function (data, array) {
        return function () {
          array.push(data);
        }
      }

            // returns an object with latitude and longitude
      function findDrivers (origin,destination) {
        return $http({
          method: 'GET',
          url: '/driver',
          data: JSON.stringify({
            origin: origin,
            destination: destination
          })
        }).success(function(data) {
          passenger.drivers = data;
        })
      }

      (passenger.getDrivers = function (array) {
        array.forEach(function (item, index) {
          $timeout(push(item,passenger.drivers), index * 50);
        })
        return passenger.drivers;
      })(drivers);

    }
}).call(this);