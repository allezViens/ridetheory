(function() {

  angular
    .module('app.core')
    .factory('googlemap', googlemap);

  function googlemap() {
    var map, overlayMap, directionsDisplay;

    return {
      convertCoordinate: convertCoordinate,
      setOriginDestination: setOriginDestination,
      getRoute: getRoute,
      createMap: createMap,
      createWaypoints: createWaypoints,
      createMarker: createMarker,
      createWP: createWP      
    };

    // helper function to convert our data tuples to markers
    function createMarkers (array) {
      var markers = [];
      angular.forEach(array,function(item) {
        markers.push(new google.maps.Marker({
          position: convertCoordinate(item.coordinates), // needs a google.maps.LatLng
          title: item.title,
        }));
      });
      placeMarkers(markers);
    }

    function placeMarkers (markers){
      angular.forEach(markers,function(marker){
        marker.setMap(map);
      });
    }

    // Converts a tuple [lat,long] to google's format 
    function convertCoordinate(coordinate) {
      return new google.maps.LatLng(coordinate[0],coordinate[1]);
    }

    function setOriginDestination(origin,destination){
      var array = [{coordinates: origin, title: "Origin"},{coordinates: destination, title: "Destination"}];
      setMapBoundaries(convertCoordinate(origin), convertCoordinate(destination));
      createMarkers(array);
    }

    function createDisplay () {
      directionsDisplay = new google.maps.DirectionsRenderer();
      return directionsDisplay;
    }    

    function setMapBoundaries (origin, destination) {
      var panelWidth = parseInt(document.getElementsByClassName('panel')[0].clientWidth);
      var projection = overlayMap.getProjection();
      var smallestLat = origin.k < destination.k ? origin.k : destination.k;
      var largestLat = origin.k < destination.k ? destination.k : origin.k;
      var smallestLong = origin.D < destination.D ? origin.D : destination.D;
      var largestLong = origin.D < destination.D ? destination.D : origin.D;
      var ne = convertCoordinate([largestLat,largestLong]);
      var sw = convertCoordinate([smallestLat,smallestLong]);
      var swPixelCoords = projection.fromLatLngToDivPixel(sw);
      var nePixelCoords = projection.fromLatLngToDivPixel(ne);
      var newSw = projection.fromDivPixelToLatLng({
        x: swPixelCoords.x - (2 * panelWidth),
        y: swPixelCoords.y
      });

      var bounds = new google.maps.LatLngBounds(newSw,ne);
      map.fitBounds(bounds);
    }

    function createMap(coordinate) {

      var styledMap;
      var mapStyles = [
        {
          "featureType": "landscape.man_made",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            { "visibility": "on" },
            { "color": "#8080d5" },
            { "hue": "#00aaff" }
          ]
        },{
          "featureType": "poi",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "landscape.natural.terrain",
          "stylers": [
            { "visibility": "on" }
          ]
        },{
          "featureType": "landscape.natural",
          "elementType": "labels",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "landscape.natural",
          "stylers": [
            { "visibility": "simplified" }
          ]
        }
      ], mapOptions = {
        zoom: 12,
        center: convertCoordinate(coordinate),
        mapTypeControl: false,
        mapTypeControlOptions: {mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']},
        streetViewControl: false,
        panControl: false,
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL,
          position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        scaleControl: true
      };
      
      // Instantiate map with styles
      styledMap = new google.maps.StyledMapType(mapStyles,{name: "Styled Map"});
      map = new google.maps.Map( document.getElementById( 'map-canvas' ),mapOptions);   
      map.mapTypes.set('map_style', styledMap);
      map.setMapTypeId('map_style');  
      map.panBy(-parseInt(document.getElementsByClassName('panel')[0].clientWidth)/2,0);

      // Create bounds
      overlayMap = new google.maps.OverlayView();
      overlayMap.draw = function () {};
      overlayMap.setMap(map);

      directionsDisplay = createDisplay();
      directionsDisplay.setMap(map);
    }

    function getRoute(origin, destination, waypoints, date) {
      var directionsService = new google.maps.DirectionsService();

      var request = {
        origin:origin,
        destination:destination,
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

    // ex. createWP( [45,-122] )
    function createWP (coordinates) {
      var waypoint = { };
      waypoint.location = convertCoordinate(coordinates);
      waypoint.stopover = true;
      return waypoint;
    }

    // passenger is an object: {originCoordinates: [], destinationCoordinates: []}
    // returns an array of origin and destination objects: [{location, stopover},{location, stopover}]
    function createWaypoints (passenger) {
      var waypoints = [ ];

      waypoints.push(createWP(passenger.originCoordinates));
      waypoints.push(createWP(passenger.destinationCoordinates));
      
      return waypoints;
    }

    function createMarker (person, coordinates) { // probably should pass the whole person object here...
      return new google.maps.Marker({
        map: map,
        position: convertCoordinate(coordinates), // needs a google.maps.LatLng
        animation: google.maps.Animation.DROP,
        title: person.id,
        opacity: (coordinates === person.destinationCoordinates && person.title !== 'driver') ? 0.2 : 1,
        test: person.comment
      });         
    }
  }
})();



