var express = require('express'),
    router = express.Router(),
    passport = require('passport');

var User = require('../models/user');

// -----------------------
// Routes
// -----------------------
router.get('/', function(req, res){
  res.redirect('/register');
});

// show secret page only if user is authenticated (isLogedIn middleware)
router.get('/secret', isloggedIn, function(req, res){
  res.render('secret', {title: 'Secret Page', username: req.user.username});
});

// Auth Routes
// -----------------------
// Show Register Form
router.get('/register', function(req, res){
  res.render('register', {error: req.flash('error'), title: 'Register'});
});

// Handle Register Form Data
router.post('/register', function(req, res){
  // register user to DB
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err){
      req.flash('error', err.message);
      res.redirect('/register');
    }
    else {
      // authenticate user
      passport.authenticate('local', {
        failureRedirect: '/login' ,
        failureFlash: true
      })(req, res, function(){
        res.redirect('/secret');
      });
    }
  });
});

// Show Login form
router.get('/login', function(req, res){
  res.render('login', {title: 'Login', error : req.flash('error')});
});

// Handle Login Form Data
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login', failureFlash: true
}), function(req, res){
  res.redirect('/secret');
});

// Handle Logout
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

// middelware
function isloggedIn(req, res, next){
  // if user authenticated (logged in)
  if(req.isAuthenticated()){
    return next();
  }
  // else
  req.flash('error', 'You need to be logged in to do that');
  res.redirect('/login');
}

module.exports = router;
