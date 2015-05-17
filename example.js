/*
 * Project: IpChecker
 * Author: delvedor
 * Twitter: @delvedor
 * License: GNU GPLv2
 * GitHub: https://github.com/delvedor/ipChecker
 *
 * 
 * This is a basic example of the use of IpChecker.
 * The GET code opens a login page and checks if the user has reached to max amount of attempts.
 * The POST checks if the result of the query is correct, 
 * is so, it logs the user and delete  the user's ip from the IpChecker's objects, 
 * if the result of the query is false, it adds the user's ip to the IpChecker's objects.
 */

var express = require('express');
var IpChecker = require("./ipChecker");
var ipc = new IpChecker((1000 * 60 * 10), 4, 'webpage');
var router = express.Router();
var checkSQL = false;
var message = "";
var display = "";

/**
 * GET request
 * @param  {Object}   req  [request params]
 * @param  {Object}   res  [response params]
 * @render {webpage}  [page]
 */
router.get('/', function(req, res) {
  if (ipc.maxAttempts(req.ip)) {
    message = 'You have made too many login attempts, wait 10 minutes before try again.';
    display = 'block';
  } else {
    message = '';
    display = 'none';
  }
  res.render('webpage', {
    display: display,
    message: message
  });
});

/**
 * POST request
 * @param  {Object}   req  [request params]
 * @param  {Object}   res  [response params]
 * @render {webpage}  [page]
 *
 * Before render the page, this function calls the functions ipc.checkIp and queryToDb.
 */
router.post('/', ipc.checkIp, queryToDb, function(req, res) {
  if (checkSQL) {
    ipc.removeIpAttempts(req.ip);
    message = 'Welcome!';
    display = 'block';
  } else {
    ipc.addIpAttempt(req.ip);
    message = 'User not found!';
    display = 'block';
  }
  res.render('webpage', {
    display: display,
    message: message
  });
});
