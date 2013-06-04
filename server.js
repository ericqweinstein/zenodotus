'use strict';

// Pull in the modules we'll need.
var express = require('express')
  , http    = require('http')
  , path    = require('path')
  , routes  = require('./routes')
  , models  = require('./models/schema');

// Set up the server.
var app = express();

app.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.get('/', function(req, res) {
  res.render('index');
});

// Start the server listening on PORT (prod)
// or localhost:8888 (dev/testing).
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port') + '...');
});

