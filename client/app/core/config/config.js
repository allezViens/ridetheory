;(function(){
'use strict';

angular
  .module('core', ['ui.router'])
  .config(main);

function main($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){

  $urlRouterProvider.otherwise('/');

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
  
  }
}).call(this);

