(function() {

  angular
    .module('app.core')
    .factory('dataservice', dataservice);

  function dataservice($http) {
    var passengers = [];

    return {
      passengers: passengers,
      getPassengers: getPassengers,
      getClientLoc: getClientLoc,

    };


    // TODO get array of passengers available in map
    function getPassengers(origin,destination) {
      console.log('origin: ', origin.k);
      console.log('destination', destination.k);
      return $http({
            url: '/passenger',
            method: "GET",
            params: {
              oLat: origin.k,
              oLong: origin.D,
              dLat: destination.k,
              dLong: destination.D
           }
        })
        .success(function (data) {
          console.log(data);
          dataservice.passengers = data;
        })
        .error(function() {
          console.log('get passengers error');
        });

      // return [{
      //   originCoordinates: [37.548270, -121.988572], // Fremont
      //   destinationCoordinates: [37.432334,-121.899574], // Milpitas
      //   id: 'Snoop Lion',
      //   comment: 'sup'
      // },
      // {
      //   originCoordinates: [37.724930,-122.156077], // San Leandro
      //   destinationCoordinates: [37.668821,-122.080796], // Hayward
      //   id: 'Mos Def',
      //   comment: 'yo, need a ride ASAP'
      // },
      // {
      //   originCoordinates: [37.593392,-122.043830], // Union City
      //   destinationCoordinates: [37.557687,-121.977035], // Pleasanton
      //   id: 'Beth Bust a Beat',
      //   comment: 'I can haz ride?'
      // }];
    }

    // This should get users local coordinates somehow...
    function getClientLoc(){
      return [37.774929,-122.419416];
    }
    
  }
})();






