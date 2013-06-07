'use strict';

var zenodotus = angular.module('zenodotus', ['ngResource']);

zenodotus.factory('User', ['$resource', function($resource) {
  return $resource('/users/:id', {id: '@id'});
}]);

zenodotus.controller('UserCtrl', ['$scope', 'User', function($scope, User) {
  $scope.users = User.query();

  $scope.search = function(query) {
    // !!! Unsafe !!!
    query = JSON.stringify(query);

    User.query({query: query}, function(users) {
      $scope.users = users;
    });
  };
}]);

