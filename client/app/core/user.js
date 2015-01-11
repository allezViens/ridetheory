(function () {

  angular
    .module('app.core')
    .factory('userService', userService);

  /* ngInject */
  function userService() {

    var user = { };

    return {
      getUser: getUser,
      setUser: setUser,
      addUserProperty: addUserProperty,
      user: user
    };

    function getUser(){
      return user;
    }

    function setUser(object){
      angular.copy(object,user);
    }

    function addUserProperty(string, value) {
      user[string] = value;
    }
  }
})();