var express  = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User     = require('./models/user');

// -----------------------
// Init App
// -----------------------
var app = express();
var port = process.env.PORT | 3000;

// view engine
app.set('view engine', 'ejs');

// --------------------
// App Middleware
// --------------------
// Use body parser to get values sent in forms via request body
app.use(express.urlencoded({ extended: true }));

// use express-session for persistent login sessions
app.use(require('express-session')({
  secret: 'this is a secret',
  resave: false,
  saveUninitialized: false
}));

// Passport config
// -----------------------
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use user model for authentication
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// -----------------------
// Mongoose
// -----------------------
mongoose.connect('mongodb://localhost/authDemoDB');

// -----------------------
// Routes
// -----------------------
app.get('/', function(req, res){
  res.redirect('/register');
});

app.get('/secret', function(req, res){
  res.render('secret', {username: req.user.username});
});

// Auth Routes
// -----------------------
// Show Register Form
app.get('/register', function(req, res){
  res.render('register');
});

// Handle Register Form Data
app.post('/register', function(req, res){
  // register user to DB
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err){
      console.log('+++++ERROR in register: ', err);
      res.redirect('/register');
    }
    else {
      // authenticate user
      passport.authenticate('local')(req, res, function(){
        res.redirect('/secret');
      });
    }
  });
});


app.listen(port, function(){
  console.log('Server started on port ' + port);
});
