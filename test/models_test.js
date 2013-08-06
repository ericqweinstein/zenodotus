'use strict';

var assert    = require('assert')
  , models    = require('../models/schema')
  , validator = require('../models/validators');

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
    it('should not create a new book with invalid data', function() {
      var badBook = new models.book({ title: ''
                                    , isbn: 666
                                    , quantity: -1
                                    , available: -1 });

      badBook.validate(function(err) {
        assert.equal(err.errors.title.type, 'required');
        assert.equal(err.errors.isbn.type, 'ISBN must be a 13-digit number without dashes.');
        assert.equal(err.errors.quantity.type, 'Quantity must be greater than zero.');
        assert.equal(err.errors.available.type, 'Availability must be positive.');
      });
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
    it('should not create a new user with invalid data', function() {
      var badUser = new models.user({ name: ''
                                    , email: 'trololol' });

      badUser.validate(function(err) {
        assert.equal(err.errors.name.type, 'required');
        assert.equal(err.errors.email.type, 'Please enter a valid e-mail address.');
        assert.equal(err.errors.admin.type, 'required');
      });
    });
  });
});

