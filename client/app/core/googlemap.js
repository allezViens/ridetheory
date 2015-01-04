(function() {

  angular
    .module('app.core')
    .factory('googlemap', googlemap);

  function googlemap() {

    var map, googlemap = {
      createMap: createMap,
      createMarkers: createMarkers
    };

    return googlemap;

    // helper function to convert our data tuples to markers
    function createMarkers (array) {
      var markers = [];
      angular.forEach(array,function(item) {
        markers.push(new google.maps.Marker({
          position: createCoordinates(item.coordinates), // needs a google.maps.LatLng
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
      createMarkers(array);
    }

    function setMapBoundaries (sw, ne) {
      var bounds = new google.maps.LatLngBounds();
      bounds.extend(ne);
      bounds.extend(sw);
      map.fitBounds(bounds);
    };

    function createMap(origin, destination) {
      map = new google.maps.Map( document.getElementById( 'map-canvas' ));      
      setMapBoundaries(convertCoordinate(origin), convertCoordinate(destination));
      setOriginDestination(origin,destination);
    };
  }
})();



