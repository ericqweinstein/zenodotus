'use strict';

var zenodotus = angular.module('zenodotus', ['ngResource']);

zenodotus.factory('Book', ['$resource', function($resource) {
  return $resource('/books/:id', {id: '@id'});
}]);

zenodotus.controller('BookCtrl', ['$scope', 'Book', function($scope, Book) {
  $scope.books = Book.query();

  $scope.search = function(query) {
    // !!! Unsafe !!!
    query = JSON.stringify(query);

    Book.query({query: query}, function(books) {
      $scope.books = books;
    });
  };

  $scope.count = function() {
     var count = 0;
     angular.forEach($scope.books, function() {
       count++;
     });
    var pluralization = count == 1 ? " title" : " titles";
    return count + pluralization;
  };
}]);

// Angular AJAX controller for retrieving
// book data via the Google Books API
//
// (Using a test ISBN for now)
function BookFetchCtrl($scope, $http) {
  $scope.method = 'JSONP'
, $scope.url    = 'https://www.googleapis.com/books/v1/volumes?q=isbn:9780139376818?callback=alertData'
, $scope.fetch  = function() {
    $scope.bookDescription = null
  , $scope.bookCoverLink   = null
  , $scope.bookInfoLink    = null;

    $http({ method: $scope.method, url: $scope.url }).
      success(function(data, status) {
        $scope.bookDescription = data['items'][0]['volumeInfo']['description'];
        $scope.bookCoverLink   = data['items'][0]['volumeInfo']['imageLinks']['thumbnail'];
        $scope.bookInfoLink    = data['items'][0]['volumeInfo']['infoLink'];
        console.log(data);
      }).
      error(function(data, status) {
        $scope.data   = data || 'Request failed.';
        $scope.status = status;
        console.log(data);
    });
  };

  $scope.alertData = function(data) { alert(data); }

  // Get the current title index for the title detail view
  //
  // BUG: $index rebinds on filter
  jQuery(document).on('click', '.book-title', function() {
    var self = this;
    $scope.$apply(function() {
      $scope.currentTitleIndex = +self.href.split('/')[3];
    });
  });
}

