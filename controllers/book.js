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

  $scope.currentTitleIndex;
  $scope.bookDescription;

  // Get the current title index for the title detail view
  jQuery(document).on('click', '.book-title', function() {
    var self = this;
    $scope.$apply(function() {
      $scope.currentTitleIndex = +self.href.split('/')[3];
    });
  });

  // AJAX request for book metadata
  // via the Google Books API
  //
  // 1. For some reason, this is being called four times for each click.
  // 2. For some reason, it's always one click behind.
  jQuery(document).on('click', '.book-title', function() {
    $scope.$apply(function() {
      // Hard code an ISBN for the test
      var response = jQuery.get('https://www.googleapis.com/books/v1/volumes?q=isbn:' + $('.isbn').html(), function() {
        }).done(function(data) { console.log('Request successful.');
                                 $scope.bookDescription = data['items'][0]['volumeInfo']['description']; })
          .fail(function() { console.log('An error occurred.'); });
      });
    });
}]);

