(function () {
  'use strict';
  
  angular
    .module('app.map')
    .controller('Map', Map);

  /* ngInject */
  function Map(googlemap,userService,dataService) {
    var vm = this;
    vm.passengers = [];

    activate();

    function activate(){
      vm.user = userService.getUser();
      googlemap.createMap(vm.user.originCoordinates,vm.user.destinationCoordinates);
      console.log(vm.passengers);
    }
  }
})();



