angular.module('app', [
  'ui.router',
  'SearchController'
])

.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

  $stateProvider

  .state('map', {
    url: '/',
    templateUrl: 'app/search.html',
    controller: 'SearchController'
  })

  $urlRouterProvider.otherwise('/');
})