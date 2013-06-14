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

  // Attributes for the title detail view
  $scope.currentTitleIndex;
  $scope.bookDescription;
  $scope.bookCoverLink;
  $scope.bookPreviewLink;

  // Get the current title index for the title detail view
  //
  // BUG: $index rebinds on filter
  jQuery(document).on('click', '.book-title', function() {
    var self = this;
    $scope.$apply(function() {
      $scope.currentTitleIndex = +self.href.split('/')[3];
    });
  });

  // AJAX request for book metadata
  // via the Google Books API
  //
  // BUG: called four times for each click
  // BUG: always one click behind
  jQuery(document).on('click', '.book-title', function() {
    $scope.$apply(function() {
      var response = jQuery.get('https://www.googleapis.com/books/v1/volumes?q=isbn:' + $('.isbn').html(), function() {
        }).done(function(data) { $scope.bookDescription = data['items'][0]['volumeInfo']['description'];
                                 $scope.bookCoverLink   = data['items'][0]['volumeInfo']['imageLinks']['thumbnail'];
                                 $scope.bookPreviewLink = data['items'][0]['volumeInfo']['infoLink']; })
          .fail(function() { console.log('An error occurred.'); });
    });
  });
}]);

