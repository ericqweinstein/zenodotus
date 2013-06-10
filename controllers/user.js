'use strict';

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

var EMAIL_REGEXP = /\^[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\$/i

zenodotus.directive('valid', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (EMAIL_REGEXP.test(viewValue)) {
          // If the username is valid...
          ctrl.$setValidity('valid', true);
          return viewValue;
        } else {
          // ...otherwise, return undefined (no model update)
          ctrl.$setValidity('valid', false);
          return undefined;
        }
      });
    }
  };
});

