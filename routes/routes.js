'use strict';

var db = require('../models/schema');

var actions = {
  index: function(req, res) {
    res.render('index', { cookieValid: req.signedCookies.rememberToken === '1'
                        , currentUser: req.session.currentUser });
  }

, login: function(req, res) {
    var userName  = req.body.firstName + ' ' + req.body.lastName
      , userEmail = req.body.email.toLowerCase();
  
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

      res.cookie('rememberToken', '1', { maxAge: 36000000, signed: true, httpOnly: true });
      req.session.currentUser = user || newUser;
      res.cookie('user', req.session.currentUser.email, { maxAge: 36000000, signed: true, httpOnly: true });

      res.redirect('/');
    });
  }

, logout: function(req, res) {
    res.clearCookie('rememberToken');
    res.clearCookie('user');
    req.session.destroy();
    res.redirect('/');
  }

, getBooks: function(req, res) {
    var query = db.book.find(function(err) {
      if (err) { console.log('An error occurred: ' + err.message); }
    }).sort('title');

    query.select('-_id -__v');

    query.exec(function(err, books) {
      if (err) {
        console.log('An error occurred: ' + err.message);
        res.render('500', { message: err });
      }
      res.json(books);
    });
  }

, addBook: function(req, res) {
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
  }

, getUsers: function(req, res) {
    if (!isLoggedIn(req)) {
      res.status(401).send('Unauthorized');
      return;
    }
    var query = db.user.find(function(err) {
      if (err) { console.log('An error occurred: ' + err.message); }
    }).sort('name');

    query.select('name email books -_id');

    query.exec(function(err, users) {
      if (err) { console.log('An error occurred: ' + err.message); }
      res.json(users);
    });
  }

, getUsersBooks: function(req, res) {
    if (req.signedCookies.user) {
      db.user.findOne({ email: req.signedCookies.user }, function(err, user) {
        if (err) { console.log('An error occurred: ' + error); }
        res.json(user.books);
      });
    } else {
      res.json('Not logged in.');
    }
  }

, checkout: function(req, res) {
    var bookIsbn  = +req.body.ISBN
      , bookTitle = req.body.title
      , user      = req.signedCookies.user;

    // !!! Potentially unsafe !!!
    db.book.update({ isbn: bookIsbn }, { $inc : { available: -1 } }, function(err) {
      if (err) { console.log('An error occurred: ' + err); }
    });

    db.user.findOneAndUpdate({ email : user }
                           , { $push : { books: { title: bookTitle, isbn: bookIsbn } } }
                           , { new : true }
                           , function(err, user) {
                               if (err) { console.log('An error occurred: ' + err); }
                           });
    res.redirect('/');
  }

, return: function(req, res) {
    var bookTitle = req.body.title
      , bookIsbn  = +req.body.isbn
      , user      = req.signedCookies.user;

    // !!! Potentially unsafe !!!
    db.book.update({ isbn: bookIsbn }, { $inc : { available: 1 } }, function(err) {
      if (err) { console.log('An error occurred: ' + err); }
    });

    db.user.findOneAndUpdate( { email : user }
                            , { $pull : { books: { title: bookTitle, isbn: bookIsbn } } }
                            , { new : true }
                            , function(err, user) {
                                if (err) { console.log('An error occurred: ' + err); }
                            });
    res.redirect('/');
  }
};

// Login helper function (TODO: Move to helpers.js)
var isLoggedIn = function(req) {
  return !!req.signedCookies.rememberToken;
};

module.exports = actions;

