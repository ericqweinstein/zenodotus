'use strict';

var zenodotus = angular.module('zenodotus', ['ngResource']);

zenodotus.factory('Book', ['$resource', function($resource) {
  return $resource('/books/:id', {id: '@id'});
}]);

var Book = $resource('/books/:id', {id: '@id'});

/*
zenodotus.controller('BookCtrl', ['$scope', 'Book', function($scope, Book) {
  $scope.books = Book.query();

  $scope.search = function(query) {
    // !!! Unsafe !!!
    query = JSON.stringify(query);

    Book.query({query: query}, function(books) {
      $scope.books = books;
    });
  };
}]);
*/
function BookCtrl($scope) {
  $scope.count = function() {
    var count = 0;
    angular.forEach($scope.books, function() {
      count++;
    });
    var pluralization = count == 1 ? " book" : " books"
    return count + pluralization;
  };

  $scope.books = Book.query();
}

