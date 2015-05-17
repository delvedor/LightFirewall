/*
 * Project: IpChecker
 * Author: delvedor
 * Twitter: @delvedor
 * License: GNU GPLv2
 * GitHub: https://github.com/delvedor/IpChecker
 */

var _; // self

function IpChecker(time, attempts, redirectPage) {
  _ = this;
  this.time = time || 1000 * 60 * 10; // time before timeout, default value 10 mins
  this.attempts = attempts || 4; // max amount of attempts, default value is 4
  this.redirectPage = redirectPage || false; // page redirect used in checkIp, default value false
  this.ipsTimeout = {};
  this.ipsAttempts = {};
}

IpChecker.prototype = {
  constructor: IpChecker
};

/**
 * checkIp
 * @param  {Object}   req  [request params]
 * @param  {Object}   res  [response params]
 * @param  {Function} next [next function]
 *
 * This function checks if exist a timeout for a given ip, 
 * if not, check if the given ip  have reached the max amount of attempts, 
 * if so, it creates a timeout of 10 minutes, during the given ip cannot make query to the db.
 * If the given ip have not reached the max amount of attempts, the function leaves continue the request.  
 */
IpChecker.prototype.checkIp = function(req, res, next) {
  var ip = req.connection.remoteAddress;
  if (_.isTimeout[ip]) {
    _.redirectPage ? res.redirect(_.redirectPage) : res.end();

  } else if (_.ipsAttempts[ip] >= _.attempts) {
    _.ipsTimeout[ip] = setTimeout(function() {
      _.removeIpTimeout(ip);
      _.removeIpAttempts(ip);
    }, _.time);
    _.redirectPage ? res.redirect(_.redirectPage) : res.end();

  } else {
    next();
  }
};

/**
 * numberOfAttempts
 * @param  {String}   ip      [ip address of the request]
 * @return {Number} attempts  [number of attempts of the ip]
 * 
 * This function return the number of attempts of a given ip, 
 * if there are not attempts, it returns 0.
 */
IpChecker.prototype.numberOfAttempts = function(ip) {
  if (_.ipsAttempts[ip])
    return _.ipsAttempts[ip];
  return 0;
};

/**
 * maxAttempts
 * @param  {String}   ip   [ip address of the request]
 * @return {Boolean}
 * 
 * This function return true if the given ip has reached the max amount of failed attempts,
 * otherwise, false.
 */
IpChecker.prototype.maxAttempts = function(ip) {
  if (_.ipsAttempts[ip] && _.ipsAttempts[ip] > _.attempts)
    return true;
  return false;
};


/**
 * addIpAttempt
 * @param {String} ip [ip address of the request]
 * 
 * This function add an attempt to the given ip in the ipsAttempts object.
 * If the given ip is not present in the ipsAttempts object, it creates a new field.
 */
IpChecker.prototype.addIpAttempt = function(ip) {
  if (_.ipsAttempts[ip])
    _.ipsAttempts[ip] = _.ipsAttempts[ip] + 1;
  else
    _.ipsAttempts[ip] = 1;
};

/**
 * removeIpAttempts
 * @param  {String}   ip   [ip address of the request]
 *
 * This function checks if the given ip is present in the ipsAttempts object, 
 * if so, it removes the ip from the object.
 */
IpChecker.prototype.removeIpAttempts = function(ip) {
  if (_.ipsAttempts[ip])
    delete _.ipsAttempts[ip];
};

/**
 * isTimeout
 * @param  {String}   ip   [ip address of the request]
 * @return {Boolean}
 * 
 * This function return true if the given ip has a timeout, 
 * otherwise, false.
 */
IpChecker.prototype.isTimeout = function(ip) {
  if (_.ipsTimeout[ip])
    return true;
  return false;
};

/**
 * addIpTimeout
 * @param {String} ip            [ip address of the request]
 * @param {Number} time          [time before timeout]
 * @param {Object} res           [response params]
 * @param {String} redirectPage  [page redirect]
 * 
 * This function add a custom timeout to the given ip in the ipsTimeout object. 
 * Then redirects the ip to the custom redirectPage or closes the connection.
 */
IpChecker.prototype.addIpTimeout = function(ip, time, res, redirectPage) {
  _.ipsTimeout[ip] = setTimeout(function() {
    _.removeIpTimeout(ip);
    _.removeIpAttempts(ip);
  }, time);
  _.ipsAttempts[ip] = _.attempts;
  redirectPage ? res.redirect(redirectPage) : res.end();
};

/**
 * removeIpTimeout
 * @param  {String}   ip   [ip address of the request]
 *
 * This function checks if the given ip is present in the ipsTimeout object, 
 * if so, it removes the ip from the object and clears the timeout.
 */
IpChecker.prototype.removeIpTimeout = function(ip) {
  if (_.ipsTimeout[ip]) {
    clearTimeout(_.ipsTimeout[ip]);
    delete _.ipsTimeout[ip];
  }
};

module.exports = IpChecker;
