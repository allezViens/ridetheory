(function() {

  angular
    .module('app.core')
    .factory('googlemap', googlemap);

  function googlemap() {

    var map, overlayMap, googlemap = {
      createMap: createMap,
      createMarkers: createMarkers,
      setOriginDestination: setOriginDestination
    };

    return googlemap;

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
    };

    function placeMarkers (markers){
      angular.forEach(markers,function(marker){
        marker.setMap(map);
      });
    }

    // Converts a tuple [lat,long] to google's format 
    function convertCoordinate(coordinate) {
      return new google.maps.LatLng(coordinate[0],coordinate[1]);
    };

    function setOriginDestination(origin,destination){
      var array = [{coordinates: origin, title: "Origin"},{coordinates: destination, title: "Destination"}];
      setMapBoundaries(convertCoordinate(origin), convertCoordinate(destination));
      createMarkers(array);
    }

    function setMapBoundaries (origin, destination) {
      overlayMap = new google.maps.OverlayView();
      overlayMap.draw = function () {};
      overlayMap.setMap(map);
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
      })

      console.log(sw,newSw);
      var bounds = new google.maps.LatLngBounds(newSw,ne);
      map.fitBounds(bounds);
    };

    function createMap(coordinate) {
      var styledMap,
        mapStyles = [
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
      /*
       * Instantiate new google map with styles
       */
      styledMap = new google.maps.StyledMapType(mapStyles,{name: "Styled Map"});
      map = new google.maps.Map( document.getElementById( 'map-canvas' ),mapOptions);   
      map.mapTypes.set('map_style', styledMap);
      map.setMapTypeId('map_style');  
      map.panBy(-parseInt(document.getElementsByClassName('panel')[0].clientWidth)/2,0);
    };
  }
})();



