'use strict';

var mongoose = require('mongoose');

var db = mongoose.createConnection('localhost', 'hs-library');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function cb() {

  var bookSchema = mongoose.Schema({
    title: {
      type: String,
      required: true,
      validate: [
        function(v) { return v.match(/\S+/) && v != ''; },
        'Book title must not be blank.'
      ]
    },

    isbn: {
      type: Number,
      required: true,
      validate: [
        function(v) { return !isNaN(v) && Math.ceil(Math.log(v + 1) / Math.LN10) == 13; },
        'ISBN must be a 13-digit number without dashes.'
      ]
    },

    quantity: {
      type: Number,
      required: true,
      validate: [
        function(v) { return v > 0; },
        'Quantity must be greater than zero.'
      ]
    },

    available: {
      type: Boolean,
      required: true,
      validate: [
        function(v) { return typeof(v) == 'boolean'; },
        'Availability must be true or false.'
      ]
    }
  });

  var userSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      validate: [
        function(v) { return v.match(/\S+/) && v != ''; },
        'Name must not be blank.'
      ]
    },

    email: {
      type: String,
      required: true,
      validate: [
        function(v) { return v.match(/(?:\S+)@(?:\S+)/); },
        'Please enter a valid e-mail address.'
      ]
    },

    admin: {
      type: Boolean,
      required: true,
      validate: [
        function(v) { return typeof(v) == 'boolean'; },
        'Admin state must be true or false.'
      ]
    },

    books: {
      type: Array
    }
  });

  var Book = mongoose.model('Book', bookSchema);
  var User = mongoose.model('User', userSchema);
});

