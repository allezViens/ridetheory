(function() {

  angular
    .module('app.core')
    .factory('dataService', dataService);

  // dataService.$inject = ['$http','$q'];

  function dataService() {

    return {
      getPassengers: getPassengers
    }

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

  }
})();



