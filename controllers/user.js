'use strict';

zenodotus.factory('UsersBooks', ['$resource', function($resource) {
  var UsersBooks = $resource('/current_users_books');

  return UsersBooks;
}]);

zenodotus.config(['$httpProvider', function($httpProvider) {
  // CSRF header for all AJAX requests
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = jQuery('#csrf-token').attr('value');
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

  // Attributes we'll get when we
  // authenticate with Hacker School
  $scope.userFirstName;
  $scope.userLastName;
  $scope.userEmail;

  $scope.login = function() {
    var self = this
      , url  = 'https://www.hackerschool.com/auth?email=' + $scope.email + '&password=' + $scope.password + '&callback=JSON_CALLBACK';

    // Our JSONP request that authenticates
    // the user via hackerschool.com/auth
    $http.jsonp(url).
      success(function(data, status) {
        $scope.userFirstName = data['first_name'];
        $scope.userLastName  = data['last_name'];
        var formData = { firstName: $scope.userFirstName, lastName: $scope.userLastName, email: $scope.email };
        // Redirect to server login path on
        // success to upsert user and set cookie
        $http({ method: 'POST'
              , url: '/login'
              , data: jQuery.param(formData) // Apparently I gotta do all the serialization around here
              , headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).
          success(function(data, status) {
            window.location = '/';
          }).
          error(function(data, status) {
            console.log(status);
            console.log(data);
          });
      }).
      error(function() {
        $scope.loginError = 'Authorization failed. (Please use your Hacker School login e-mail and password.)';
    });
  };
}]);

