/*
 * Project: ipChecker
 * Version: 1.1.0
 * Author: delvedor
 * Twitter: @delvedor
 * License: GNU GPLv2
 * GitHub: https://github.com/delvedor/ipChecker
 *
 *
 * This is a basic example of the use of ipChecker in ExpressJs.
 * The GET code opens a login page and checks if the user has reached to max amount of attempts.
 * The POST checks if the result of the query is correct,
 * is so, it logs the user and delete  the user's ip from the ipChecker's objects,
 * if the result of the query is false, it adds the user's ip to the ipChecker's objects.
 */

var express = require('express');
var router = express.Router();

var IpChecker = require("./ipChecker");
var ipc = new IpChecker((1000 * 60 * 10), 4);

var message = "";
var display = "";

/**
 * GET request
 * @param  {Object}   req  [request params]
 * @param  {Object}   res  [response params]
 * @render {webpage}  [page]
 */
router.get('/', function(req, res) {
  ipc.maxAttempts(req.ip, function(bool) {
    console.log('maxAttempts ' + bool);
  });

  ipc.numberOfAttempts(req.ip, function(attempts) {
    console.log('numberOfAttempts ' + attempts);
  });

  ipc.isTimeout(req.ip, function(isTimeout) {
    console.log('isTimeout ' + isTimeout);
    message = 'get';
    if (isTimeout)
      message = 'timeout';
    res.render('index', {
      message: message
    });
  });
});

/**
 * POST request
 * @param  {Object}   req  [request params]
 * @param  {Object}   res  [response params]
 * @render {webpage}  [page]
 */
router.post('/', function(req, res, next) {
  ipc.checkIp(req.ip, function(isTimeout) {
    if (isTimeout) {
      res.end();
      return;
    }
    if (req.body.text === 'correct') {
      ipc.removeIpAttempts(req.ip);
      message = 'ok!';
    } else {
      ipc.addIpAttempt(req.ip);
      message = 'error';
    }
    res.render('index', {
      message: message
    });
  });
});
