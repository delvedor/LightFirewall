/*
 * Project: IpChecker
 * Version: 1.0.1
 * Author: delvedor
 * Twitter: @delvedor
 * License: GNU GPLv2
 * GitHub: https://github.com/delvedor/ipChecker
 */

export default class ipChecker {
  constructor(time = 1000 * 60 * 10, attempts = 4, redirectPage = false) {
    this.time = time; // time before timeout, default value 10 mins
    this.attempts = attempts; // max amount of attempts, default value is 4
    this.redirectPage = redirectPage; // page redirect used in checkIp, default value false
    this.ipsTimeout = {};
    this.ipsAttempts = {};
  }

  /**
   * setDefaultParams
   * @param {Number}  time         [time before timeout, default value 10 mins]
   * @param {Number}  attempts     [max amount of attempts, default value is 4]
   * @param {String}  redirectPage [page redirect used in checkIp, default value false]
   * @param {Boolean} reset [if true, it resets the ipsTimeout and ipsAttempts objects, default value false]
   *
   * This function sets the custom values of time, attempts and redirectPage,
   * if reset it's true, it resets the ipsTimeout and ipsAttempts objects,
   * if this values are not given, it uses the defaults values.
   */
  setParams(time = 1000 * 60 * 10, attempts = 4, redirectPage = false, reset = false) {
    this.time = time;
    this.attempts = attempts;
    this.redirectPage = redirectPage;
    if (reset) {
      this.ipsTimeout = {};
      this.ipsAttempts = {};
    }
  }

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
  checkIp(req, res, next) {
    let ip = req.connection.remoteAddress;
    if (this.isTimeout(ip)) {
      this.redirectPage ? res.redirect(this.redirectPage) : res.end();

    } else if (this.ipsAttempts[ip] >= this.attempts) {
      let timeout = new Date();
      timeout.setMilliseconds(timeout.getMilliseconds() + this.time);
      this.ipsTimeout[ip] = timeout;
      this.redirectPage ? res.redirect(this.redirectPage) : res.end();

    } else {
      next();
    }
  }

  /**
   * numberOfAttempts
   * @param  {String}   ip      [ip address of the request]
   * @return {Number} attempts  [number of attempts of the ip]
   *
   * This function return the number of attempts of a given ip,
   * if there are not attempts, it returns 0.
   */
  numberOfAttempts(ip) {
    if (this.ipsAttempts[ip])
      return this.ipsAttempts[ip];
    return 0;
  }

  /**
   * maxAttempts
   * @param  {String}   ip   [ip address of the request]
   * @return {Boolean}
   *
   * This function return true if the given ip has reached the max amount of failed attempts,
   * otherwise, false.
   */
  maxAttempts(ip) {
    if (this.ipsAttempts[ip] && this.ipsAttempts[ip] >= this.attempts)
      return true;
    return false;
  }

  /**
   * addIpAttempt
   * @param {String} ip [ip address of the request]
   *
   * This function add an attempt to the given ip in the ipsAttempts object.
   * If the given ip is not present in the ipsAttempts object, it creates a new field.
   */
  addIpAttempt(ip) {
    if (this.ipsAttempts[ip])
      this.ipsAttempts[ip] = this.ipsAttempts[ip] + 1;
    else
      this.ipsAttempts[ip] = 1;
  }

  /**
   * removeIpAttempts
   * @param  {String}   ip   [ip address of the request]
   *
   * This function checks if the given ip is present in the ipsAttempts object,
   * if so, it removes the ip from the object.
   */
  removeIpAttempts(ip) {
    if (this.ipsAttempts[ip])
      delete this.ipsAttempts[ip];
  }

  /**
   * isTimeout
   * @param  {String}   ip   [ip address of the request]
   * @return {Boolean}
   *
   * This function return true if the given ip has a timeout,
   * otherwise, false.
   */
  isTimeout(ip) {
    if (this.ipsTimeout[ip]) {
      let date = new Date();
      if (date < this.ipsTimeout[ip]) {
        return true;
      } else {
        this.removeIpTimeout(ip);
        this.removeIpAttempts(ip);
        return false;
      }
    }
    return false;
  }

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
  addIpTimeout(ip, time, res, redirectPage) {
    let timeout = new Date();
    timeout.setMilliseconds(timeout.getMilliseconds() + time);
    this.ipsTimeout[ip] = timeout;
    this.ipsAttempts[ip] = this.attempts;
    redirectPage ? res.redirect(redirectPage) : res.end();
  }

  /**
   * removeIpTimeout
   * @param  {String}   ip   [ip address of the request]
   *
   * This function checks if the given ip is present in the ipsTimeout object,
   * if so, it removes the ip from the object and clears the timeout.
   */
  removeIpTimeout(ip) {
    if (this.ipsTimeout[ip])
      delete this.ipsTimeout[ip];
  }
}
