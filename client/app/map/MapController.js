(function () {
  'use strict';
  
  angular
    .module('app.gmap')
    .controller('MapCtrl', MapCtrl);

  /* ngInject */
  function MapCtrl(GoogleFactory) {
    var vm = this;
    // Activate map
    GoogleFactory.initialize(55.6468, 37.581);
  }
})();