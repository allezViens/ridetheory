(function() {

  angular
    .module('app.core')
    .factory('GoogleFactory', GoogleFactory);

  function GoogleFactory($http, $q, $stateParams, RouterboxFactory, RouteFactory, $rootScope) {
    var map, directionsDisplay, overlayMap;
    var userMarkers = [];
    var tripMarkers = [undefined, undefined];

    services = {
      addUserMarker: addUserMarker,
      convertToLocation: convertToLocation,
      drawRoute: drawRoute,
      initialize: initialize,
      removeDestination: removeDestination,
      removeOrigin: removeOrigin,
      setOrigin: setOrigin,
      setDestin: setDestin
    };

    return services;


    function addUserMarker(coordinate, alias, email, origin) {
      iconOrigin = 'green.png';
      iconDestination = 'red.png';
      icon = 'yellow.png';

      var marker = new google.maps.Marker({
        map: map,
        icon: icon,
        position: convertToLocation(coordinate),
        draggable: false,
        customEmail: email,
        customOrigin: origin
      });

      userMarkers.push(marker);
      
      google.maps.event.addListener(marker, 'click', function() {
        $rootScope.$broadcast('tripUpdated',marker.customEmail);
      });

      google.maps.event.addListener(marker, 'mouseover', function(){
        var markers = findMatchingMarker(marker.customEmail);
        markers.origin.setIcon(iconOrigin);
        markers.destination.setIcon(iconDestination);
      });

      google.maps.event.addListener(marker, 'mouseout', function() {
          var markers = findMatchingMarker(marker.customEmail);
          markers.origin.setIcon(icon);
          markers.destination.setIcon(icon);
      });
    }

    function boundMap() {
      var bounds = new google.maps.LatLngBounds();
      console.log('before:',map);
      angular.forEach(tripMarkers, function(marker){
        if(marker && marker.position){
          bounds.extend(marker.position);
        }
      });

      if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
        var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.05, bounds.getNorthEast().lng() + 0.05);
        var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.05, bounds.getNorthEast().lng() - 0.05);
        bounds.extend(extendPoint1);
        bounds.extend(extendPoint2);
      }

      map.fitBounds(bounds);
    }

    function convertToLocation(coordinate) {
      return new google.maps.LatLng(coordinate[0], coordinate[1]);
    }

    function drawRoute(origin, destination, waypoints, callback) {
      var directionsService = new google.maps.DirectionsService();
      directionsDisplay.setMap(map);

      var request = {
        origin: convertToLocation(origin),
        destination: convertToLocation(destination),
        travelMode: google.maps.TravelMode.DRIVING,
        transitOptions: {
          departureTime: new Date() // need date here
        },
        waypoints: waypoints,
        optimizeWaypoints: true
      };
      
      directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(result);
          GoogleFactory.routeWaypoints = result.kc.waypoints;
          GoogleFactory.routeOrder = result.routes[0].waypoint_order;
          
          var waypoints = [];
          for(var i=0; GoogleFactory.routeWaypoints && i < GoogleFactory.routeWaypoints.length; i++){
            var waypoint = GoogleFactory.routeWaypoints[GoogleFactory.routeOrder[i]];
            waypoints.push([waypoint.location.k, waypoint.location.D]);
          }

          GoogleFactory.routeWaypoints = waypoints;
          if (callback) {
            callback(GoogleFactory.routeWaypoints);
          }
        }
      });
    }

    function findMatchingMarker(email) {
      var markers = {};
      for (var i=0; i < userMarkers.length; i++) {
        if (userMarkers[i].customEmail === email) {
          if (userMarkers[i].customOrigin){
            markers.origin = userMarkers[i];
          } else {
            markers.destination = userMarkers[i];
          }
        }
      }
      return markers;
    }

    function getMatchesArray(originCoords, destinationCoords) {
      return $http({
        method: 'GET',
        url: '/api/' + vm.type,
        params: {
          oLat: originCoords[0],
          oLon: originCoords[1]
        }
      });
    }

    function initialize(lat, lon) {
      var center = new google.maps.LatLng(lat, lon);
      var mapStyles = [{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":100},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"hue":"#D1D3D4"},{"saturation":-88},{"lightness":-7},{"visibility":"on"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"hue":"#939598"},{"saturation":-91},{"lightness":-34},{"visibility":"on"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#414042"},{"saturation":-98},{"lightness":-60},{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"hue":"#E3EBE5"},{"saturation":-61},{"lightness":57},{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"hue":"#E3EBE5"},{"saturation":-100},{"lightness":57},{"visibility":"on"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"all","stylers":[{"hue":"#E3EBE5"},{"saturation":-100},{"lightness":81},{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"hue":"#E3EBE5"},{"saturation":-100},{"lightness":81},{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"geometry","stylers":[{"hue":"#FFFFFF"},{"saturation":0},{"lightness":100},{"visibility":"on"}]},{"featureType":"administrative.locality","elementType":"labels","stylers":[{"hue":"#939598"},{"saturation":2},{"lightness":59},{"visibility":"on"}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"hue":"#939598"},{"saturation":-100},{"lightness":16},{"visibility":"on"}]},{"featureType":"administrative.neighborhood","elementType":"all","stylers":[{"hue":"#939598"},{"saturation":-100},{"lightness":16},{"visibility":"on"}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"hue":"#939598"},{"saturation":-100},{"lightness":16},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#939598"},{"saturation":-98},{"lightness":-8},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"hue":"#FFFFFF"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#6D6E71"},{"saturation":-98},{"lightness":-43},{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"hue":"#FFFFFF"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"on"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"hue":"#FFFFFF"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]}];
      var mapOptions = {zoom: 10, center: center, mapTypeControl: false, mapTypeControlOptions: {mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']}, streetViewControl: false, panControl: false, zoomControl: true, zoomControlOptions: {style: google.maps.ZoomControlStyle.SMALL, position: google.maps.ControlPosition.RIGHT_BOTTOM}, scaleControl: true};
      // Instantiate map with styles
      document.getElementById('map-canvas').style.height = window.innerHeight + "px";
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);   
      map.mapTypes.set('map_style', new google.maps.StyledMapType(mapStyles, {name: "Styled Map"}));
      map.setMapTypeId('map_style');  

      // Create bounds
      overlayMap = new google.maps.OverlayView();
      overlayMap.draw = function () {};
      overlayMap.setMap(map);

      directionsDisplay = new google.maps.DirectionsRenderer();
      directionsDisplay.setMap(map);
    }

    function removeDestination() {
      tripMarkers[1].setMap(null);
      tripMarkers[1] = undefined;   
      directionsDisplay.setMap(null);
    }

    function removeOrigin() {
      tripMarkers[0].setMap(null);
      tripMarkers[0] = undefined;
      directionsDisplay.setMap(null);
    }

    function setDestin(coordinate) {
      setTripMarker(coordinate, 1); 
    }

    function setTripMarker(coordinate, position) {
      if (tripMarkers[position]){
        tripMarkers[position].setMap(null);
      }

      tripMarkers[position] = new google.maps.Marker({
        position: convertToLocation(coordinate),
        map: map
      });
      
      console.log('tripmarkers',map);
      tripMarkers[position].setMap(map);
      boundMap();
    }

    function setOrigin(coordinate) {
      setTripMarker(coordinate, 0);
    }
    
  }
})();