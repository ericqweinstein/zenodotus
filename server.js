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
app.use(app.router);
app.use(express.static('public'));
app.use(express.static('controllers'));
app.use(express.favicon('public/img/favicon.ico'));

/* Routes */

// Render the only page (SPA FTW)
app.get('/', function(req, res) {
  res.render('index');
});

// JSON endpoint for books
app.get('/books', function(req, res) {
  db.book.find(function(err, books) {
    if (err) { console.log('An error occurred.'); }
    res.send(books);
  });
});

// Start the server listening on PORT
// (prod) or localhost:8888 (dev/testing)
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port') + '...');
});

