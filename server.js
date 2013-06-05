'use strict';

// Pull in the modules we'll need.
var express = require('express')
  , http    = require('http')
  , routes  = require('./routes')
  , db      = require('./models/schema');

// Set up the server.
var app = express();

app.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static('public'));
app.use(express.favicon('public/img/favicon.ico'));
// Check controllers/ for Angular controller JS.
app.use(express.static('controllers'));

// Routes
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/books', function(req, res) {
  var books = db.book.find();
  res.render('books', { locals: { books: books } });
});

// Start the server listening on PORT (prod)
// or localhost:8888 (dev/testing).
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port') + '...');
});

