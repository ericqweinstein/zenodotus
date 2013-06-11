'use strict';

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

app.get('/', function(req, res) {
  res.render('index', { cookieValid: req.signedCookies.rememberToken === '1'
                      , isAdmin: req.session.isAdmin });
});

app.post('/signup', function(req, res) {
  var userName = req.body.fname.trim() + ' ' + req.body.lname.trim()
    , email    = req.body.email
    , password = req.body.password;

  var newUser = new db.user({ name: userName
                            , email: email
                            , password: password
                            , admin: false
                            , books: [] });

  // TODO: Check if email is already in the DB
  // & tell user to log in rather than sign up
  newUser.save(function(err) {
    if (err) {
      console.log(err.message);
      res.render('500', { message: err.message });
    }
  });
  
  res.cookie('rememberToken', '1', { maxAge: 36000000, signed: true });
  res.render('index');
});

app.post('/login', function(req, res) {
  var userEmail     = req.body.email
    , userPassword  = req.body.password
    , passwordError = 'Incorrect username/password combination.';

  // Check if user exists
  db.user.findOne({ email: userEmail }, function(err, user) {
    if (err) {
      console.log(err.message);
      res.render('500', { message: err.message });
    }
    if (!user) res.send(passwordError);

    // Check hashed password against password in the database
    user.comparePassword(userPassword, function(err, isMatch) {
      if (err) console.log(err);

      if (isMatch) {
        res.cookie('rememberToken', '1', { maxAge: 36000000, signed: true });
        req.session.isAdmin = user.admin

        res.render('index');
      } else {
        res.send(passwordError);
      }
    });
  });
});

app.get('/logout', function(req, res) {
  res.clearCookie('rememberToken');
  req.session.destroy();
  res.render('index');
});

// JSON endpoint for books
app.get('/books', function(req, res) {
  db.book.find(function(err, books) {
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
  
  res.render('index');
});

// JSON endpoint for users (TEMPORARY)
app.get('/users', function(req, res) {
  db.user.find(function(err, users) {
    if (err) { console.log('An error occurred: ' + err.message); }
    res.json(users);
  });
});

// Handle errors
app.use(function(req, res) {
  res.render('404', { message: 'Sorry, that page doesn\'t exist.' });
});

/* Start the server */

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port') + '.');
});

