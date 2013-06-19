'use strict';

zenodotus.factory('UsersBooks', ['$resource', function($resource) {
  var UsersBooks = $resource('/current_users_books');

  return UsersBooks;
}]);

zenodotus.controller('UserCtrl', ['$scope', '$http', 'UsersBooks', function($scope, $http, UsersBooks) {
  $scope.books = UsersBooks.query();

  $scope.search = function(query) {
    // !!! Unsafe !!!
    query = JSON.stringify(query);

    UsersBooks.query({query: query}, function(books) {
      $scope.books = books;
    });
  };

  // The attributes we'll get from the HS application
  $scope.userFirstName;
  $scope.userLastName;
  $scope.userEmail;

  $scope.login = function() {
    var self = this
      , url  = 'https://www.hackerschool.com/auth?email=' + $scope.email + '&password=' + $scope.password + '&callback=JSON_CALLBACK';

    $http.jsonp(url).
      success(function(data, status) {
        $scope.userFirstName = data['first_name'];
        $scope.userLastName  = data['last_name'];
        // Redirect to server login path
        // to upsert user and set cookie
        $http({ method: 'POST', url: '/login'}).
          success(function(data, status) {
            console.log('Success!');
          }).
          error(function(data, status) {
            console.log('Error.');
          });
      }).
      error(function(data, status) {
        $scope.data   = data || 'Request failed.';
        $scope.status = status;
        console.log(status);
        console.log(data);
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

