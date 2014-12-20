;(function(){
'use strict';

angular
  .module('app')
  .config( main );

function main($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){

  $stateProvider
  .state('Compose', {
    url: '/',
    templateUrl: 'app/core/views/compose.html',
    controller: 'ComposeController as vm'
  });

  $stateProvider
  .state('Paths', {
    url: '/paths',
    templateUrl: 'app/core/views/paths.html',
    controller: 'ComposeController as vm'
  });  
  
  $urlRouterProvider.otherwise('/');




  }
}).call(this);

