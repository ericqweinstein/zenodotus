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
app.use(app.router);
app.use(express.static('public'));
app.use(express.static('controllers'));
app.use(express.favicon('public/img/favicon.ico'));

/* Routes */

app.get('/', function(req, res) {
  res.render('index', {cookieValid: req.signedCookies.test === '1'});
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

  newUser.save(function(err) {
    if (err) console.log(err.message);
  });
  console.log('Successfully saved user.');
  
  res.cookie('test', '1', { maxAge: 36000000, signed: true });
  res.redirect('/');
});

app.post('/login', function(req, res) {
  res.cookie('test', '1', { maxAge: 36000000, signed: true });
  res.redirect('/');
});

app.get('/logout', function(req, res) {
  res.clearCookie('test');
  res.redirect('/');
});

// JSON endpoint for books
app.get('/books', function(req, res) {
  db.book.find(function(err, books) {
    if (err) { console.log('An error occurred: ' + err); }
    res.json(books);
  });
});

// JSON endpoint for users (TEMPORARY)
app.get('/users', function(req, res) {
  db.user.find(function(err, users) {
    if (err) { console.log('An error occurred: ' + err); }
    res.json(users);
  });
});

// Handle errors
app.use(function(req, res) {
  res.render('404');
});

/* Start the server */

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port') + '...');
});

