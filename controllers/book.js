'use strict';

var zenodotus = angular.module('zenodotus', ['ngResource']);

zenodotus.factory('Book', ['$resource', function($resource) {
  var Book = $resource('/books/:id', {id: '@id'});

  Book.prototype.getUrl = function() {
    return 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + this.isbn + '&callback=JSON_CALLBACK'
  };

  Book.prototype.getTitle = function() {
    return this.title;
  };

  Book.prototype.getIsbn = function() {
    return this.isbn;
  };

  Book.prototype.isAvailable = function() {
    return this.available;
  };

  return Book;
}]);

zenodotus.controller('BookCtrl', ['$scope', '$http', 'Book', function($scope, $http, Book) {
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

  // Attributes for title detail view
  $scope.bookTitle       = null
, $scope.bookDescription = null
, $scope.bookCoverLink   = null
, $scope.bookInfoLink    = null
, $scope.bookIsAvailable = null;

  // Angular AJAX controller for retrieving
  // book data via the Google Books API
  $scope.fetch  = function($event) {
    var self = this;
    $http.jsonp(self.book.getUrl()).
      success(function(data, status) {
        $scope.bookDescription = data['items'][0]['volumeInfo']['description'];
        $scope.bookCoverLink   = data['items'][0]['volumeInfo']['imageLinks']['thumbnail'];
        $scope.bookInfoLink    = data['items'][0]['volumeInfo']['infoLink'];
        $scope.bookTitle       = self.book.getTitle();
        $scope.bookIsbn        = self.book.getIsbn()
        $scope.bookIsAvailable = self.book.isAvailable();
      }).
      error(function(data, status) {
        $scope.data   = data || 'Request failed.';
        $scope.status = status;
        console.log(status);
        console.log(data);
    });
  };
}]);

