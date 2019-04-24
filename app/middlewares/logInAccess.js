const express = require('express');
const config = require('../../config/config');
const jwt    = require('jsonwebtoken');
const app = express();

app.set('superSecret', config.secret);

module.exports = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        console.log(err)
        res.status(401);
        return res.send('Failed to authenticate token.');
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401);
    res.send('No token provided.');
  }
}
