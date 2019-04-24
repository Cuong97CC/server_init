const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const express = require('express');
const app = express();
const config = require('../../config/config');

const { handleSuccessResponse, handleErrorResponse } = require('../helpers/responseHelper');

app.set('superSecret', config.secret);

module.exports.signUp = async (req, res) => {
  try {
    if (req.body.password !== req.body.passwordConf) return handleErrorResponse(res, "Mật khẩu xác nhận không khớp");
    if (req.body.email && req.body.username && req.body.password && req.body.passwordConf) {
      let {email, username, password, passwordConf} = req.body;
      email = email.toLowerCase();
      let user = await User.findOne({email: email});
      if (user) return handleErrorResponse(res, "Email đã được sử dụng");
      let new_user = new User({
        email: email,
        username: username,
        password: password,
        passwordConf: passwordConf,
      });
      await new_user.save();
      let data = {email: email, username: username, role: user.role};
      let token = await jwt.sign(data, app.get('superSecret'), {
        expiresIn: '24h'
      });
      return handleSuccessResponse(res, {user: data, token: token}, "Đăng ký thành công");
    } else {
      return handleErrorResponse(res, "Chưa điền đủ thông tin");
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports.logIn = async (req, res) => {
  try {
    if (req.body.email && req.body.password) {
      await User.authenticate(req.body.email, req.body.password, async (error, user) => {
        if (error || !user) {
          return handleErrorResponse(res, "Sai email hoặc mật khẩu");
        } else {
          let data = {email: user.email, username: user.username, role: user.role};
          let token = await jwt.sign(data, app.get('superSecret'), {
            expiresIn: '24h'
          });
          return handleSuccessResponse(res, {user: data, token: token}, "Đăng nhập thành công");
        }
      });
    } else {
      return handleErrorResponse(res, "Chưa điền đủ thông tin");
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports.logOut = async (req, res) => {
  try {
    return handleSuccessResponse(res, {user: null, token: null}, null);
  } catch (err) {
    console.log(err)
  }
}
