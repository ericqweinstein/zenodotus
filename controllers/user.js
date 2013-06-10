'use strict';

zenodotus.factory('User', ['$resource', function($resource) {
  return $resource('/users/:id', {id: '@id'});
}]);

zenodotus.controller('UserCtrl', ['$scope', 'User', function($scope, User) {
  // Put this back for now
  $scope.users = User.query();

  $scope.search = function(query) {
    // !!! Unsafe !!!
    query = JSON.stringify(query);

    User.query({query: query}, function(users) {
      $scope.users = users;
    });
  };
}]);

zenodotus.directive('ngPasswordValid', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (viewValue.length >= 8) {
          // If the password is valid...
          ctrl.$setValidity('pwd', true);
          return viewValue;
        } else {
          // ...otherwise, return undefined (no model update)
          ctrl.$setValidity('pwd', false);
          return undefined;
        }
      });
    }
  };
});

