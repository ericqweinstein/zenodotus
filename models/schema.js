'use strict';

var mongoose = require('mongoose')
  , bcrypt   = require('bcrypt')
  , SALT_WORK_FACTOR = 10;

mongoose.connect('mongodb://localhost/hs-library');

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
      function(v) { return v.match(/\S+/) && v !== ''; },
      'Book title must not be blank.'
    ]
  },

  isbn: {
    type: Number,
    required: true,
    validate: [
      function(v) { return !isNaN(v) && Math.ceil(Math.log(v + 1) / Math.LN10) === 13; },
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
      function(v) { return typeof(v) === 'boolean'; },
      'Availability must be true or false.'
    ]
  }
});

var userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: [
      function(v) { return v.match(/\S+/) && v !== ''; },
      'Name must not be blank.'
    ]
  },

  email: {
    type: String,
    required: true,
    index: { unique: true },
    validate: [
      function(v) { return v.match(/(?:\S+)@(?:\S+)/); },
      'Please enter a valid e-mail address.'
    ]
  },

  password: {
    type: String,
    required: true
  },

  admin: {
    type: Boolean,
    required: true,
    validate: [
      function(v) { return typeof(v) === 'boolean'; },
      'Admin state must be true or false.'
    ]
  },

  books: {
    type: Array
  }
});

userSchema.pre('save', function(next) {
  var user = this;
  
  // Hash the password if new or modified
  if (!user.isModified('password')) {
    return next;
  }

  // Generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    // Hash the password along with the new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }

      // Finally, override the cleartext password
      // with the hashed one
      user.password = hash;
      next();
    });
  });
});

// Compare the submitted hashed password to the
// password stored in the database
userSchema.methods.comparePassword = function(possiblePassword, cb) {
  bcrypt.compare(possiblePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var Book = mongoose.model('Book', bookSchema, 'book');
var User = mongoose.model('User', userSchema, 'user');

exports.book = Book;
exports.user = User;

