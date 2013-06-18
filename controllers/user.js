'use strict';

zenodotus.factory('UsersBooks', ['$resource', function($resource) {
  var UsersBooks = $resource('/current_users_books');

  return UsersBooks;
}]);

zenodotus.controller('UserCtrl', ['$scope', 'UsersBooks', function($scope, UsersBooks) {
  $scope.books = UsersBooks.query();

  $scope.search = function(query) {
    // !!! Unsafe !!!
    query = JSON.stringify(query);

    UsersBooks.query({query: query}, function(books) {
      $scope.books = books;
    });
  };
}]);

zenodotus.directive('ngPasswordValid', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(possiblePassword) {
        if (possiblePassword.length >= 8) {
          // If the password is valid...
          ctrl.$setValidity('pwd', true);
          return possiblePassword;
        } else {
          // ...otherwise, return undefined (no model update)
          ctrl.$setValidity('pwd', false);
          return undefined;
        }
      });
    }
  };
});

