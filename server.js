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
  , routes  = require('./routes/routes');

/* Configure server */

var app = express();

app.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('test secret'));
app.use(express.session({ secret: 'test secret' }));
app.use(app.router);
app.use(express.csrf());
app.use(express.static('public'));
app.use(express.static('controllers'));
app.use(express.favicon('public/img/favicon.ico'));

/* CSRF protection */

function csrf(req, res, next) {
  res.locals.token = req.session._csrf;
  next();
}

/* Routes */

// Render index view
app.get('/', csrf, routes.index);

// Handle login (auth done by Hacker School)
app.post('/login', csrf, routes.login);

// Clear cookies and session on logout
app.get('/logout', routes.logout);

// JSON endpoint for books
app.get('/books', csrf, routes.getBooks);

// Add a book to the database
app.post('/books', csrf, routes.addBook);

// JSON endpoint for users
app.get('/users', csrf, routes.getUsers);

// JSON endpoint for the logged-in user's books
app.get('/current_users_books', csrf, routes.getUsersBooks);

// Check out a book
app.post('/checkout', csrf, routes.checkout);

// Return a book
app.post('/return', csrf, routes.return);

// Handle requests for nonexistent routes
app.use(function(req, res) {
  res.render('404', { message: 'Sorry, that page doesn\'t exist.' });
});

/* Start the server */

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port') + '.');
});

