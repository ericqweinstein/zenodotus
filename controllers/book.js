'use strict';

function BookCtrl($scope) {
  $scope.books = [{ text: 'The UNIX Programming Environment' }];

  $scope.count = function() {
    var count = 0;
    angular.forEach($scope.books, function() {
      count++;
    });
    var pluralization = count == 1 ? " book" : " books"
    return count + pluralization;
  };
}

