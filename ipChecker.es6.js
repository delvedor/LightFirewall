/*
 * Project: IpChecker
 * Version: 1.1.0
 * Author: delvedor
 * Twitter: @delvedor
 * License: GNU GPLv2
 * GitHub: https://github.com/delvedor/ipChecker
 */

import level from 'level';

export default class IpChecker {
  constructor(time = 1000 * 60 * 10, attempts = 4) {
    this.time = time; // time before timeout, default value 10 mins
    this.attempts = attempts; // max amount of attempts, default value is 4
    this.ipsTimeout = level('.ipchecker-ipstimeout');
    this.ipsAttempts = level('.ipchecker-ipsattempts');
  }

  /**
   * setDefaultParams
   * @param {Number}  time         [time before timeout in milliseconds, default value 10 mins]
   * @param {Number}  attempts     [max amount of attempts, default value is 4]
   *
   * This function sets the custom values of time and attempts,
   * if this values are not given, it uses the defaults values.
   */
  setParams(time = 1000 * 60 * 10, attempts = 4) {
    this.time = time;
    this.attempts = attempts;
  }

  /**
   * checkIp
   * @param  {String}     ip        [ip address of the request]
   * @param  {Function}   callback  [callback]
   *
   * This function checks if exist a timeout for the ip,
   * if not, check if the given ip  have reached the max amount of attempts, if so, it creates a timeout and the callback returns true.
   * If the given ip have not reached the max amount of attempts, the callback returns false.
   */
  checkIp(ip, callback) {
    this.ipsTimeout.get(ip, (err, value) => {
      if (value)
        callback(true);
      else
        this.ipsAttempts.get(ip, (err2, attempt) => {
          attempt = attempt || 0;
          if (attempt >= this.attempts) {
            let timeout = new Date();
            timeout.setMilliseconds(timeout.getMilliseconds() + this.time);
            this.ipsTimeout.put(ip, timeout, (err3) => {
              if (err3)
                console.log(`ipChecker/checkIp error -> ${err3}`);
            });
            callback(true);
          } else {
            callback(false);
          }
        });
    });
  }

  /**
   * numberOfAttempts
   * @param  {String}   ip        [ip address of the request]
   * @param {Function} callback   [callback]
   *
   * The callback returns the number of attempts of a given ip,
   * if there are not attempts, it returns null.
   */
  numberOfAttempts(ip, callback) {
    this.ipsAttempts.get(ip, (err, attempt) => {
      attempt = Number(attempt) || null;
      callback(attempt);
    });
  }

  /**
   * maxAttempts
   * @param  {String}   ip        [ip address of the request]
   * @param {Function} callback   [callback]
   *
   * The callback returns true if the given ip has reached the max amount of failed attempts,
   * otherwise, false.
   */
  maxAttempts(ip, callback) {
    this.ipsAttempts.get(ip, (err, attempt) => {
      attempt = Number(attempt) || 0;
      callback(attempt >= this.attempts);
    });
  }

  /**
   * addIpAttempt
   * @param {String} ip [ip address of the request]
   *
   * This function adds an attempt to the given ip in the ipsAttempts db.
   * If the given ip is not present in the ipsAttempts db, it creates a new field.
   */
  addIpAttempt(ip) {
    this.ipsAttempts.get(ip, (err, attempt) => {
      if (!attempt)
        attempt = 1;
      else
        attempt++;
      this.ipsAttempts.put(ip, attempt, (err2) => {
        if (err2)
          console.log(`ipChecker/addIpAttempt error -> ${err2}`);
      });
    });
  }

  /**
   * removeIpAttempts
   * @param  {String}   ip   [ip address of the request]
   *
   * This function checks if the given ip is present in the ipsAttempts db,
   * if so, it removes the ip from the db.
   */
  removeIpAttempts(ip) {
    this.ipsAttempts.get(ip, (err, attempt) => {
      if (attempt)
        this.ipsAttempts.del(ip, (err2) => {
          if (err2)
            console.log(`ipChecker/removeIpAttempts error -> ${err2}`);
        });
    });
  }

  /**
   * isTimeout
   * @param  {String}   ip        [ip address of the request]
   * @param {Function} callback   [callback]
   *
   * The callback returns true if the given ip has a timeout,
   * otherwise, false.
   */
  isTimeout(ip, callback) {
    this.ipsTimeout.get(ip, (err, value) => {
      if (!value) {
        callback(false);
      } else if (new Date() < Date.parse(value)) {
        callback(true);
      } else {
        this.ipsTimeout.del(ip, (err2) => {
          if (err2)
            console.log(`ipChecker/isTimeout error -> ${err2}`);
        });
        this.ipsAttempts.del(ip, (err2) => {
          if (err2)
            console.log(`ipChecker/isTimeout error -> ${err2}`);
        });
        callback(false);
      }
    });
  }

  /**
   * addIpTimeout
   * @param {String} ip            [ip address of the request]
   * @param {Number} time          [time before timeout]
   * @param {Function} callback    [callback]
   *
   * This function adds a custom timeout to the given ip in the ipsTimeout db.
   * Then calls the callback.
   */
  addIpTimeout(ip, time, callback) {
    let timeout = new Date();
    timeout.setMilliseconds(timeout.getMilliseconds() + time);
    this.ipsTimeout.put(ip, timeout, (err) => {
      if (err)
        console.log(`ipChecker/addIpTimeout error -> ${err}`);
    });
    this.ipsAttempts.put(ip, this.attempts, (err) => {
      if (err)
        console.log(`ipChecker/addIpTimeout error -> ${err}`);
    });
    callback();
  }

  /**
   * removeIpTimeout
   * @param  {String}   ip   [ip address of the request]
   *
   * This function checks if the given ip is present in the ipsTimeout db,
   * if so, it removes the ip from the db and clears the timeout.
   */
  removeIpTimeout(ip) {
    this.ipsTimeout.get(ip, (err, value) => {
      if (value)
        this.ipsTimeout.del(ip, (err2) => {
          if (err2)
            console.log(`ipChecker/removeIpTimeout error -> ${err2}`);
        });
    });
  }
}
