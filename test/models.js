'use strict';

var assert = require('assert')
  , models = require('../models/schema');

describe('Book', function() {
  describe('creation', function() {
    it('should create a new book with valid data', function() {
      var testBook = new models.book({ title: 'Mongo and You'
                                 , isbn: 9780123456789
                                 , quantity: 1
                                 , available: 1 });

      assert.equal(testBook.title, 'Mongo and You');
      assert.equal(testBook.isbn, 9780123456789);
      assert.equal(testBook.quantity, 1);
      assert.equal(testBook.available, 1);
    });
  });
});

describe('User', function() {
  describe('creation', function() {
    it('should create a new user with valid data', function() {
      var testUser = new models.user({ name: 'Oxnard Montalvo'
                                     , email: 'oxnard@montalvo.net'
                                     , admin: false
                                     , books: ['Mongo and You'] });

      assert.equal(testUser.name, 'Oxnard Montalvo');
      assert.equal(testUser.email, 'oxnard@montalvo.net');
      assert.deepEqual(testUser.admin, false);
      assert.equal(testUser.books[0], 'Mongo and You');
    });
  });
});

