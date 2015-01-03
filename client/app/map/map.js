(function () {
  'use strict';
  
  angular
    .module('app.map')
    .controller('Map', Map);

  /* ngInject */
  function Map(googlemap,userService,dataservice) {
    var vm = this;
    vm.passengers = [];

    activate();

    function activate(){
      googlemap.createMap([37.774929,-122.419416]);
    }
  }
})();



