var express  = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    flash    = require('connect-flash');
    User     = require('./models/user');

// require routes handler
var indexRouter = require('./routes/index');

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
app.use(flash());

// Configure passport-local to use user model for authentication
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// -----------------------
// Mongoose
// -----------------------
mongoose.connect('mongodb://localhost/authDemoDB');

// Register Routes
app.use(indexRouter);

app.listen(port, function(){
  console.log('Server started on port ' + port);
});
