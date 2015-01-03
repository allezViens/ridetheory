(function () {

  angular
    .module('app.core')
    .factory('userService', userService);

  /* ngInject */
  function userService($http) {

    var user = {};

    return {
      getUser: getUser,
      setUser: setUser
    }

    function getUser(){
      return user;
    }

    function setUser(object){
      angular.copy(object,user);
    }
  }
})();



