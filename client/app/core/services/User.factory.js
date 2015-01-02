;(function () {
  'use strict';
  
  angular
    .module('core','app')
    .factory('UserFactory', UserFactory);

    function UserFactory($scope, $http, $q, $state){
      var user = this;

      // gets all form data from compose.html
      function createUser (user) {
        user = angular.copy(user);
        return user;
      }
    }).call(this);
    

