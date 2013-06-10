'use strict';

zenodotus.factory('User', ['$resource', function($resource) {
  return $resource('/users/:id', {id: '@id'});
}]);

zenodotus.controller('UserCtrl', ['$scope', 'User', function($scope, User) {
  // TK
}]);

zenodotus.directive('ngPasswordValid', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (viewValue.length >= 8) {
          // If the username is valid...
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

zenodotus.directive('ngUserExists', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(emailAddress) {
        // Test with hard-coded value
        if (emailAddress === 'eric.q.weinstein@gmail.com') {
          ctrl.$setValidity('knownUser', true);
          return emailAddress;
        } else {
          ctrl.$setValidity('knownUser', false);
          return undefined;
        }
      });
    }
  };
});

