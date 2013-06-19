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

var thisUser;

app.get('/', function(req, res) {
  res.render('index', { cookieValid: req.signedCookies.rememberToken === '1'
                      , currentUser: req.session.currentUser });
});

app.post('/login', function(req, res) {
  // var userName  = req.body.firstName + ' ' + req.body.lastName
  //   , userEmail = req.body.email;
  
  console.log('POST to /login detected. Setting cookie...');

  res.cookie('rememberToken', '1', { maxAge: 36000000, signed: true });

  console.log('Cookie set. Redirecting to index...');

  res.redirect('/');

    // , passwordError = 'Incorrect username/password combination.';

  /* Check if user exists
  db.user.findOne({ email: userEmail }, function(err, user) {
    if (err) {
      console.log(err.message);
      res.render('500', { message: err.message });
    }
    if (!user) { // First time logging in
      var newUser = new db.user({ name: userName
                                , email: userEmail
                                , admin: false
                                , books: [] });
    }

    newUser.save(function(err) {
      if (err) {
        console.log(err.message);
        res.render('500', { message: err.message });
      }
    });

    // Check hashed password against password in the database
    // user.comparePassword(userPassword, function(err, isMatch) {
      // if (err) console.log(err);

      // if (isMatch) {
    res.cookie('rememberToken', '1', { maxAge: 36000000, signed: true });
    req.session.currentUser = thisUser = user;

    res.redirect('/');
    //  } else {
    //    res.send(passwordError);
    //  }
    //});
  }); */
});

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

app.post('/books', function(req, res) {
  var bookTitle = req.body.title.trim()
    , bookIsbn  = +req.body.isbn.trim()
    , bookQty   = +req.body.quantity.trim();

  var newBook = new db.book({ title: bookTitle
                            , isbn: bookIsbn
                            , quantity: bookQty
                            , available: true });

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
//
// TODO: Refactor, this is pretty jank
app.get('/current_users_books', function(req, res) {
  if (thisUser) {
    res.json(thisUser.books);
  } else {
    res.json('Not logged in.');
  }
});

app.post('/checkout', function(req, res) {
  var bookIsbn  = +req.body.ISBN
    , bookTitle = req.body.title
    , user      = thisUser;

  // !!! Unsafe !!!
  //
  // TODO: Handle where qty > 1,
  // DRY up all this error handling
  db.book.update({ isbn: bookIsbn }, { $set : { available: false } }, function(err) {
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

app.post('/return', function(req, res) {
  var bookTitle = req.body.title
    , bookIsbn  = +req.body.isbn
    , user      = thisUser;

  // !!! Unsafe !!!
  db.book.update({ isbn: bookIsbn }, { $set : { available: true } }, function(err) {
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

// Handle errors
app.use(function(req, res) {
  res.render('404', { message: 'Sorry, that page doesn\'t exist.' });
});

/* Start the server */

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port') + '.');
});

