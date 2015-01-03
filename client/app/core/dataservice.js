(function() {

  angular
    .module('app.core')
    .factory('dataservice', dataservice);

  function dataservice() {
    return {
      getPassengers: getPassengers,
      getClientLoc: getClientLoc
    }

    // TODO get array of passengers available in map
    function getPassengers(origin,destination) {
      return [{
        coordinates: [37.774929,-122.419416],
        title: 'Jon Blue'
      },
      {
        coordinates: [37.333596,-121.890704],
        title: 'Jorge Green'
      },
      {
        coordinates: [37.343596,-122.850704],
        title: 'Janet White'
      },
      {
        coordinates: [36.363596,-122.990704],
        title: 'Jill Black'
      }];
    }

    // TODO return IP address for 
    function getClientLoc(){
      return [37.774929,-122.419416];
    }
    
  }
})();






