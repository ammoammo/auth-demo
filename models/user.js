var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// Create User Schema
var userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// plugin passport-local-mongoose to Schema
userSchema.plugin(passportLocalMongoose);

// Model the Schema and export the model User
module.exports = mongoose.model('User', userSchema)
