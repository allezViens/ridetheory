(function () {
  'use strict';
  
  angular
    .module('app.gmap')
    .controller('MapCtrl', MapCtrl);

  /* ngInject */
  function MapCtrl(GoogleFactory,RouteFactory) {
    var vm = this;

    vm.sendMessage = function(){
      console.log('hi');
    }

    // when user clicks 

    // Activate map
    GoogleFactory.initialize(37.7833,-122.4167);
  }
})();