(function () {

  angular
    .module('app.core')
    .factory('userService', userService);

  /* ngInject */
  function userService() {

    var user = {
      origin: 'Berkeley, CA',
      destination: 'San Jose, CA',
      title: 'driver',
      id: 'jonarnaldo@gmail.com',
      originCoordinates: [37.871593, -122.272747],
      destinationCoordinates: [37.333596, -121.890704]
    };

    return {
      getUser: getUser,
      setUser: setUser
    };

    function getUser(){
      return user;
    }

    function setUser(object){
      angular.copy(object,user);
    }
  }
})();



