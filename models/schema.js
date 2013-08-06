'use strict';

var mongoose  = require('mongoose')
  , validates = require('./validators')
  , LOCAL_DB  = 'mongodb://localhost/hs-library'
  , REMOTE_DB = process.env.MONGOHQ_URL;

mongoose.connect(REMOTE_DB || LOCAL_DB);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.on('open', function() {
  console.log('MongoDB is connected to ' + db.name + '.');
});

var bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    validate: [
      validates.title,
      'Book title must not be blank.'
    ]
  },

  isbn: {
    type: Number,
    required: true,
    validate: [
      validates.isbn,
      'ISBN must be a 13-digit number without dashes.'
    ]
  },

  quantity: {
    type: Number,
    required: true,
    validate: [
      validates.quantity,
      'Quantity must be greater than zero.'
    ]
  },

  available: {
    type: Number,
    required: true,
    validate: [
      validates.available,
      'Availability must be positive.'
    ]
  }
});

var userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: [
      validates.name,
      'Name must not be blank.'
    ]
  },

  email: {
    type: String,
    required: true,
    index: { unique: true },
    validate: [
      validates.email,
      'Please enter a valid e-mail address.'
    ]
  },

  admin: {
    type: Boolean,
    required: true
  },

  books: {
    type: Array
  }
});

var Book = mongoose.model('Book', bookSchema, 'book');
var User = mongoose.model('User', userSchema, 'user');

exports.book = Book;
exports.user = User;

