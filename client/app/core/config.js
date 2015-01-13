;(function(){
'use strict';

angular
  .module('app.core')
  .config(config);

  function config($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){

    // $urlRouterProvider.otherwise('/');

    $stateProvider


    .state('create', {
      abstract: true,
      url: '/',
      views: {
        'main' : {
          templateUrl: 'app/partials/create.html'
        }
      }
    })
    .state('create.subs',{
      url: '',
      views: {
        'map@create': {
          templateUrl: 'app/map/map.html',
          controller: 'MapCtrl as vm'
        },
        'postroute@create': {
          templateUrl: 'app/postroute/postroute.html',
          controller: 'PostRouteCtrl as vm',
        }
      }
    })
    .state('trip', {
      resolve: {
        tripData: function ($stateParams, $http) {
          return $http.get('/api/trip/' + $stateParams.id)
            .then(function(response) {
              return response.data;
          });
          // return {
          //   origin: [1.9, 22.1], 
          //   destination: [3.3,4.5], 
          //   date: "", 
          //   picks:[
          //   {alias:"jimbo", email: "jimbo@gmail.com", status: "pending"},
          //   {alias:"teeg", email: "tgk@gmail.com", status: "confirmed"}
          //   ]
          // };
        }  
      },
      abstract: true,
      url: '/trip/:id',
      views: {
        'main' : {
          templateUrl: 'app/partials/edit.html'
        }
      }
    })
    .state('trip.subs', {
      url: '',
      views: {
        'map@trip': {
          templateUrl: 'app/map/map.html',
          controller: 'MapCtrl as vm'
        },
        'routebox@trip': {
          templateUrl: 'app/routebox/routebox.html',
          controller: 'RouteCtrl as vm',
        }
      }
    })

    $locationProvider.html5Mode(true);
  }
}).call(this);

