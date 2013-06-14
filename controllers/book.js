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

  $scope.tokenizeTitle = function(title) {
    var forbiddenTokens = /[-:\/?!.;]/g;
    var cleanedTitle    = title.toLowerCase().replace(forbiddenTokens, '');
    return cleanedTitle.replace(/\s+/g, '-');
  };

  $scope.currentTitleIndex = 0;

  jQuery(document).on('click', '.book-title', function() {
    var self = this;
    $scope.$apply(function() {
      $scope.currentTitleIndex = +self.href.split('/')[3];
    });
  });
}]);

