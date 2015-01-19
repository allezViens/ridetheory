(function() {

  angular
    .module('app.core')
    .factory('GoogleFactory', GoogleFactory);

  function GoogleFactory($http,$q, $stateParams,RouterboxFactory, RouteFactory, $rootScope) {
    var map, directionsDisplay, overlayMap;
    var userMarkers = [];
    var tripMarkers = [undefined,undefined];

    services = {
      convertToLocation: convertToLocation,
      initialized: false,
      initialize: initialize,
      setOrigin: setOrigin,
      setDestin: setDestin,
      removeOrigin: removeOrigin,
      removeDestination: removeDestination,
      drawRoute: drawRoute,
      addUserMarker: addUserMarker
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
        map: map,
        
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

    function drawRoute(origin, destination, waypoints,callback) {
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
          if (result.kc.waypoints){
            GoogleFactory.routeWaypoints = result.kc.waypoints;
            GoogleFactory.routeOrder = result.routes[0].waypoint_order;
            var waypoints = [];
            for(var i=0; i < GoogleFactory.routeWaypoints.length;i++){
              var waypoint = GoogleFactory.routeWaypoints[GoogleFactory.routeOrder[i]];
              waypoints.push([waypoint.location.k,waypoint.location.D]);
            }
            GoogleFactory.routeWaypoints = waypoints;
            callback(GoogleFactory.routeWaypoints);
          }
        }
      });
    }

    
    function addUserMarker(coordinate,alias,email,origin){

      iconOrigin = 'iconOrigin.png';
      iconDestination = 'iconDestination.png';
      icon = 'icon.png';

      var marker = new google.maps.Marker({
        map: map,
        icon: icon,
        position: convertToLocation(coordinate),
        draggable: false,
        customEmail: email,
        customOrigin: origin
      });


      userMarkers.push(marker);
      var contentString = '<div><h1>' + alias + '</h1></div>';

      alias = new InfoBubble({
        map: map,
        content: contentString,
        position: convertToLocation(coordinate),
        shadowStyle: 1,
        padding: 0,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.9)',
        minWidth: 100,
        maxWidth: 200,
        minHeight: 50,
        arrowSize: 1,
        borderWidth: 1,
        disableAutoPan: true,
        hideCloseButton: true,
        arrowPosition: -5,
        backgroundClassName: 'bubble',
        arrowStyle: 1
      });

      google.maps.event.addListener(marker, 'click', function() {
        // pickUser('tommyklon@gmail.com');
        $rootScope.$broadcast('tripUpdated',marker.customEmail);
      });

      google.maps.event.addListener(marker,'mouseover',function(){
        // alias.open(map,marker);
        var markers = findMatchingMarker(marker.customEmail);
        // alias.open(map,match);
        markers.origin.setIcon(iconOrigin);
        markers.destination.setIcon(iconDestination);
      })

      google.maps.event.addListener(marker, 'mouseout', function() {
          var markers = findMatchingMarker(marker.customEmail);
          markers.origin.setIcon(icon);
          markers.destination.setIcon(icon);
      });
    }

    function findMatchingMarker(email){
      var markers = {};
      for (var i=0;i<userMarkers.length;i++){
        if(userMarkers[i].customEmail === email){
          if(userMarkers[i].customOrigin){
            markers.origin = userMarkers[i];
          }else{
            markers.destination = userMarkers[i];
          }
        }
      }
      return markers;
    }

    function getMatchesArray(originCoords, destinationCoords){
      return $http({
        method: 'GET',
        url: '/api/' + vm.type,
        params: {
          oLat: originCoords[0],
          oLon: originCoords[1],
        }
      })
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
      var mapStyles = [{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":100},{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"hue":"#D1D3D4"},{"saturation":-88},{"lightness":-7},{"visibility":"on"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"hue":"#939598"},{"saturation":-91},{"lightness":-34},{"visibility":"on"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#414042"},{"saturation":-98},{"lightness":-60},{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"hue":"#E3EBE5"},{"saturation":-61},{"lightness":57},{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"hue":"#E3EBE5"},{"saturation":-100},{"lightness":57},{"visibility":"on"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"all","stylers":[{"hue":"#E3EBE5"},{"saturation":-100},{"lightness":81},{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"hue":"#E3EBE5"},{"saturation":-100},{"lightness":81},{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"geometry","stylers":[{"hue":"#FFFFFF"},{"saturation":0},{"lightness":100},{"visibility":"on"}]},{"featureType":"administrative.locality","elementType":"labels","stylers":[{"hue":"#939598"},{"saturation":2},{"lightness":59},{"visibility":"on"}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"hue":"#939598"},{"saturation":-100},{"lightness":16},{"visibility":"on"}]},{"featureType":"administrative.neighborhood","elementType":"all","stylers":[{"hue":"#939598"},{"saturation":-100},{"lightness":16},{"visibility":"on"}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"hue":"#939598"},{"saturation":-100},{"lightness":16},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#939598"},{"saturation":-98},{"lightness":-8},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"hue":"#FFFFFF"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#6D6E71"},{"saturation":-98},{"lightness":-43},{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"hue":"#FFFFFF"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"hue":"#000000"},{"saturation":-100},{"lightness":-100},{"visibility":"on"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"hue":"#FFFFFF"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]}];
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
      var polylineDefines = new google.maps.Polyline({
        strokeColor: '#7FC8ED',
        strokeOpacity: 0.5,
        strokeWeight: 10
      });
      directionsDisplay = new google.maps.DirectionsRenderer({
        polylineOptions: polylineDefines
      });
      directionsDisplay.setMap(map);
      services.initialized = true;
    }
  }
})();