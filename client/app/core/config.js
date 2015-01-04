;(function(){
'use strict';

angular
  .module('app.core')
  .config(config);

function config($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){

  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('Search', {
    url: '/',
    templateUrl: 'app/search/search.html',
    controller: 'Search as vm'
  });

  $stateProvider
  .state('Map', {
    url: '/map',
    templateUrl: 'app/map/map.html',
    controller: 'Map as vm',
  });

  }
}).call(this);

