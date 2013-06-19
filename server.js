'use strict';

/*
 * Zenodotus
 *
 * An application to track books in the Hacker School library.
 * Named for the first librarian of the Library of Alexandria.
 *
 * (c) 2013 Eric Weinstein
 *
 * See LICENSE for copying
 */

/* Modules */

var express = require('express')
  , http    = require('http')
  , routes  = require('./routes')
  , db      = require('./models/schema');

/* Configure server */

var app = express();

app.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('test secret'));
app.use(express.session({}));
app.use(app.router);
app.use(express.static('public'));
app.use(express.static('controllers'));
app.use(express.favicon('public/img/favicon.ico'));

/* Routes */

// Save a reference to the current user
var thisUser;

// Render index view
app.get('/', function(req, res) {
  res.render('index', { cookieValid: req.signedCookies.rememberToken === '1'
                      , currentUser: req.session.currentUser });
});

// Handle login (auth done by Hacker School)
app.post('/login', function(req, res) {
  var userName  = req.body.firstName + ' ' + req.body.lastName
    , userEmail = req.body.email;
  
  // Look up the user if (s)he exists...
  db.user.findOne({ email: userEmail }, function(err, user) {
    if (err) {
      console.log(err.message);
      res.render('500', { message: err.message });
    }
    // ...or create a new user on first login.
    if (!user) {
      var newUser = new db.user({ name: userName
                                , email: userEmail
                                , admin: false
                                , books: [] });

      newUser.save(function(err) {
        if (err) {
          console.log(err.message);
          res.render('500', { message: err.message });
        }
      });
    }

    res.cookie('rememberToken', '1', { maxAge: 36000000, signed: true });
    req.session.currentUser = thisUser = user;

    res.redirect('/');
  });
});

// Clear cookies and session on logout
app.get('/logout', function(req, res) {
  res.clearCookie('rememberToken');
  req.session.destroy();
  res.redirect('/');
});

// JSON endpoint for books
app.get('/books', function(req, res) {
  var query = db.book.find(function(err) {
    if (err) { console.log('An error occurred: ' + err.message); }
  }).sort('title');

  query.select('-_id -__v');

  query.exec(function(err, books) {
    if (err) { console.log('An error occurred: ' + err.message); }
    res.json(books);
  });
});

// Add a book to the database
app.post('/books', function(req, res) {
  var bookTitle = req.body.title.trim()
    , bookIsbn  = +req.body.isbn.trim()
    , bookQty   = +req.body.quantity.trim();

  var newBook = new db.book({ title: bookTitle
                            , isbn: bookIsbn
                            , quantity: bookQty
                            , available: bookQty });

  // TODO: Check if book is already in the DB
  // & tell user to ++ qty rather than add new
  newBook.save(function(err) {
    if (err) {
      console.log(err.message);
      res.render('500', { message: err.message });
    }
  });

  res.redirect('/');
});

// JSON endpoint for users
app.get('/users', function(req, res) {
  var query = db.user.find(function(err) {
    if (err) { console.log('An error occurred: ' + err.message); }
  }).sort('name');

  query.select('name email books -_id');

  query.exec(function(err, users) {
    if (err) { console.log('An error occurred: ' + err.message); }
    res.json(users);
  });
});

// JSON endpoint for the logged-in user's books
app.get('/current_users_books', function(req, res) {
  if (thisUser) {
    res.json(thisUser.books);
  } else {
    res.json('Not logged in.');
  }
});

// Check out a book
app.post('/checkout', function(req, res) {
  var bookIsbn  = +req.body.ISBN
    , bookTitle = req.body.title
    , user      = thisUser;

  // !!! Potentially unsafe !!!
  //
  // TODO: DRY up all this error handling
  db.book.update({ isbn: bookIsbn }, { $inc : { available: -1 } }, function(err) {
    if (err) { console.log('An error occurred: ' + err); }
  });

  db.user.findOneAndUpdate({ email : thisUser.email }
                         , { $push : { books: { title: bookTitle, isbn: bookIsbn } } }
                         , { new : true }
                         , function(err, user) {
                             if (err) { console.log('An error occurred: ' + err); }
                             thisUser = user;
                         });

  res.redirect('/');
});

// Return a book
app.post('/return', function(req, res) {
  var bookTitle = req.body.title
    , bookIsbn  = +req.body.isbn
    , user      = thisUser;

  // !!! Potentially unsafe !!!
  db.book.update({ isbn: bookIsbn }, { $inc : { available: 1 } }, function(err) {
    if (err) { console.log('An error occurred: ' + err); }
  });

  db.user.findOneAndUpdate( { email : thisUser.email }
                          , { $pull : { books: { title: bookTitle, isbn: bookIsbn } } }
                          , { new : true }
                          , function(err, user) {
                              if (err) { console.log('An error occurred: ' + err); }
                              thisUser = user;
                          });

  res.redirect('/');
});

// Handle requests for nonexistent routes
app.use(function(req, res) {
  res.render('404', { message: 'Sorry, that page doesn\'t exist.' });
});

/* Start the server */

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port') + '.');
});

