(function () {
  'use strict';
  
  angular
    .module('app.gmap')
    .controller('MapCtrl', MapCtrl);

  /* ngInject */
  function MapCtrl(GoogleFactory,RouteFactory,$scope, dataservice) {
    var vm = this;

    //dyanmically set map width
    var panelWidth = document.getElementsByClassName('fixed-side')[0].offsetWidth;
    var mapWidth = 'width:' + (window.innerWidth  - panelWidth) + 'px';
    document.getElementsByClassName('map')[0].setAttribute("style",mapWidth);

    // Activate map
    console.log('calling!');
    dataservice.getClientLoc();    
  }
})();