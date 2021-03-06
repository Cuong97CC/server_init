const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "member"
  }
});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  email = email.toLowerCase();
  User.findOne({ email: email }).exec(function (err, user) {
    if (err) {
      return callback(err)
    } else if (!user) {
      var err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback();
      }
    })
  });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 5, (err, hash) => {
    if (err) {
      console.log(err)
      return next(err);
    }
    user.password = hash;
    user.passwordConf = hash;
    next();
  })
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
