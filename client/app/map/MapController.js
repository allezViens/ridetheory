(function () {
  'use strict';
  
  angular
    .module('app.gmap')
    .controller('MapCtrl', MapCtrl);

  /* ngInject */
  function MapCtrl(GoogleFactory,RouteFactory) {
    var vm = this;

    // when user clicks 

    // Activate map
    GoogleFactory.initialize(55.6468, 37.581);
  }
})();