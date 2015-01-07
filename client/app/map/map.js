(function () {
  'use strict';
  
  angular
    .module('app.map')
    .controller('Map', Map);

  /* ngInject */
  function Map(googlemap,userService,dataservice) {
    var vm = this;
    vm.passengers = dataservice.passengers;

    //////////////////////  DRIVER COORDINATES ///////////////////////////////////////////////////////
      // DRIVER     
      // vm.user has been hardcoded with dummy data
      vm.user = userService.getUser();
      var origin = googlemap.convertCoordinate(vm.user.originCoordinates);
      var destination = googlemap.convertCoordinate(vm.user.destinationCoordinates);

      /////////////////////////////////////////  CREATE MAP ////////////////////////////////////////////////////

      var map = googlemap.createMap(dataservice.getClientLoc());

      ////////////////////////////////////  ADD PASSENGER MARKERS //////////////////////////////

      // PASSENGERS
      // GET possible passengers: [ {passenger}, {passenger} ]
      dataservice.getPassengers(origin,destination)
        .then(function() {
          vm.passengers = dataservice.passengers;
        });
      
      (function addPassengerMarkers (passengers) {
        angular.forEach(passengers, function (passenger) {
          var o = googlemap.createMarker(passenger, passenger.originCoordinates);
          var d = googlemap.createMarker(passenger, passenger.destinationCoordinates);
          addPassenger(o);
          addPassenger(d);
        });
      })(vm.passengers);

      ///////////////////////////////////  ADD PASSENGERS ////////////////////////////////////////////////

      // adds passenger object to vm.passengers
      function addPassenger (marker) {
        // disable click on marker here

        var contentString = '<div>' + marker.title + '</div><div>' + marker.test + '</div>';
        var infowindow = new google.maps.InfoWindow({ content: contentString });

        google.maps.event.addListener(marker, 'click', function () {
          // find passenger in list of possible passengers
          angular.forEach(vm.passengers, function (passenger) {
            if (passenger.id === marker.title) {
              vm.passengers.push(googlemap.createWaypoints(passenger));
            }
          });
          
          vm.passengers = _.flatten(vm.passengers);
          // rerun route
          googlemap.getRoute(origin, destination, vm.passengers);
        });

        google.maps.event.addListener(marker, 'mouseover', function () {
          infowindow.open(map,marker);
          console.log(marker);
          // find destination marker
        });

        google.maps.event.addListener(marker, 'mouseout', function () {
          infowindow.close();
          console.log(marker);
          // find destination marker
        });          
      }
    }
})();



