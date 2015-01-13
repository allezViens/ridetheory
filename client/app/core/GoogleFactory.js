(function() {

  angular
    .module('app.core')
    .factory('GoogleFactory', GoogleFactory);

  function GoogleFactory($http) {
    var map, directionsDisplay, overlayMap;
    var userMarkers = [];
    var tripMarkers = [undefined,undefined];

    services = {
      initialize: initialize,
      setOrigin: setOrigin,
      setDestin: setDestin,
      removeOrigin: removeOrigin,
      removeDestination: removeDestination,
      drawRoute: drawRoute
    }

    return services;

    function convertToLocation(coordinate){
      return new google.maps.LatLng(coordinate[0],coordinate[1]);
    }

    function setOrigin(coordinate){
      setTripMarker(coordinate,0);
    }

    function removeOrigin(){
      tripMarkers[0].setMap(null);
      tripMarkers[0] = undefined;
      directionsDisplay.setMap(null);
    }

    function setDestin(coordinate){
      setTripMarker(coordinate,1); 
    }

    function removeDestination(){
      tripMarkers[1].setMap(null);
      tripMarkers[1] = undefined;   
      directionsDisplay.setMap(null);
    }

    // [x],[y]
    function setTripMarker(coordinate,position) {
      if (tripMarkers[position]){
        tripMarkers[position].setMap(null);
      }
      tripMarkers[position] = new google.maps.Marker({
        position: convertToLocation(coordinate),
        map: map
      });
      tripMarkers[position].setMap(map);
      boundMap();
    }

    function boundMap() {
      var bounds = new google.maps.LatLngBounds();
      angular.forEach(tripMarkers,function(marker){
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

    function drawRoute(origin, destination, waypoints) {
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
        }
      });
    }

    function messageUser(to,from,message) {
      var payload = { 
        from: from,
        to: to,
        fromType: from.type,
        message: message
      }
      return $http({
        method: 'POST',
        url: '/api/message',
        data: JSON.stringify(payload)
      })
      .success(function (data) {
        // TODO display successful send to user
        console.log(data);
      })
      .error(function(){
        console.log("could not send message");
      });     
    }
   
    function initialize(lat,lon) {
      var center = new google.maps.LatLng(lat, lon);
      var mapStyles = [{"stylers":[{"visibility":"off"}]},{"featureType":"road","stylers":[{"visibility":"on"},{"color":"#ffffff"}]},{"featureType":"road.arterial","stylers":[{"visibility":"on"},{"color":"#fee379"}]},{"featureType":"road.highway","stylers":[{"visibility":"on"},{"color":"#fee379"}]},{"featureType":"landscape","stylers":[{"visibility":"on"},{"color":"#f3f4f4"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#7fc8ed"}]},{},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#83cead"}]},{"elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"weight":0.9},{"visibility":"off"}]}];
      var mapOptions = {zoom: 10,center: center,mapTypeControl: false,mapTypeControlOptions: {mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']},streetViewControl: false,panControl: false,zoomControl: true,zoomControlOptions: {style: google.maps.ZoomControlStyle.SMALL,position: google.maps.ControlPosition.RIGHT_BOTTOM},scaleControl: true};
      // Instantiate map with styles
      document.getElementById('map-canvas').style.height = window.innerHeight + "px";
      map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);   
      map.mapTypes.set('map_style', new google.maps.StyledMapType(mapStyles,{name: "Styled Map"}));
      map.setMapTypeId('map_style');  

      // Create bounds
      overlayMap = new google.maps.OverlayView();
      overlayMap.draw = function () {};
      overlayMap.setMap(map);
      directionsDisplay = new google.maps.DirectionsRenderer();
      directionsDisplay.setMap(map);
    }
  }
})();