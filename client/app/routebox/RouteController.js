(function () {
  'use strict';
  
  angular
    .module('app.route')
    .controller('RouteCtrl', RouteCtrl);

    /* ngInject */
    function RouteCtrl(tripData,GoogleFactory){
      var vm = this;

      var user = tripData.driver || tripData.passenger;
      vm.date = user.date;
      vm.origin = user.origin;
      vm.destination = user.destination;
      vm.id = user.id;
      vm.picks = user.picks;
      vm.init = initialize;

      function initialize(){
        GoogleFactory.setOrigin(vm.origin);
        GoogleFactory.setDestin(vm.destination);
        GoogleFactory.drawRoute(vm.origin, vm.destination);
      };
  }
})();
    

