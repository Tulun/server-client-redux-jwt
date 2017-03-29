const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our Model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On save hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
  // Get access to user model.
  const user = this;

  // Generate a salt, then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); };

    // Hash our password using a salt.
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); };

      // Overwrite plain text password with encrypted password.
      user.password = hash;
      next();
    });

  });

});

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;