;(function(){
'use strict';

angular
  .module('app.core')
  .config(config);

  function config($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){

    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'app/index.html',
      views: {
        'map@': {
          templateUrl: 'app/map/map.html',
          controller: 'Map as vm'
        },
        'searchbox@': {
          templateUrl: 'app/search/search.html',
          controller: 'Search as vm',
        }
      }
    });
  }
}).call(this);

