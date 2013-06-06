'use strict';

var zenodotus = angular.module('zenodotus', ['ngResource']);

zenodotus.factory('User', ['$resource', function($resource) {
  return $resource('/users/:id', {id: '@id'});
}]);

zenodotus.controller('UserCtrl', ['$scope', 'User', function($scope, User) {
  // Controller magicks TK
}]);

