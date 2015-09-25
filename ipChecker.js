/*
 * Project: IpChecker
 * Version: 1.1.0
 * Author: delvedor
 * Twitter: @delvedor
 * License: GNU GPLv2
 * GitHub: https://github.com/delvedor/ipChecker
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _level = require('level');

var _level2 = _interopRequireDefault(_level);

var IpChecker = (function () {
  function IpChecker() {
    var time = arguments.length <= 0 || arguments[0] === undefined ? 1000 * 60 * 10 : arguments[0];
    var attempts = arguments.length <= 1 || arguments[1] === undefined ? 4 : arguments[1];

    _classCallCheck(this, IpChecker);

    this.time = time; // time before timeout, default value 10 mins
    this.attempts = attempts; // max amount of attempts, default value is 4
    this.ipsTimeout = (0, _level2['default'])('.ipchecker-ipstimeout');
    this.ipsAttempts = (0, _level2['default'])('.ipchecker-ipsattempts');
  }

  /**
   * setDefaultParams
   * @param {Number}  time         [time before timeout in milliseconds, default value 10 mins]
   * @param {Number}  attempts     [max amount of attempts, default value is 4]
   *
   * This function sets the custom values of time and attempts,
   * if this values are not given, it uses the defaults values.
   */

  _createClass(IpChecker, [{
    key: 'setParams',
    value: function setParams() {
      var time = arguments.length <= 0 || arguments[0] === undefined ? 1000 * 60 * 10 : arguments[0];
      var attempts = arguments.length <= 1 || arguments[1] === undefined ? 4 : arguments[1];

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
  }, {
    key: 'checkIp',
    value: function checkIp(ip, callback) {
      var _this = this;

      this.ipsTimeout.get(ip, function (err, value) {
        if (value) callback(true);else _this.ipsAttempts.get(ip, function (err2, attempt) {
          attempt = attempt || 0;
          if (attempt >= _this.attempts) {
            var timeout = new Date();
            timeout.setMilliseconds(timeout.getMilliseconds() + _this.time);
            _this.ipsTimeout.put(ip, timeout, function (err3) {
              if (err3) console.log('ipChecker/checkIp error -> ' + err3);
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
  }, {
    key: 'numberOfAttempts',
    value: function numberOfAttempts(ip, callback) {
      this.ipsAttempts.get(ip, function (err, attempt) {
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
  }, {
    key: 'maxAttempts',
    value: function maxAttempts(ip, callback) {
      var _this2 = this;

      this.ipsAttempts.get(ip, function (err, attempt) {
        attempt = Number(attempt) || 0;
        callback(attempt >= _this2.attempts);
      });
    }

    /**
     * addIpAttempt
     * @param {String} ip [ip address of the request]
     *
     * This function adds an attempt to the given ip in the ipsAttempts db.
     * If the given ip is not present in the ipsAttempts db, it creates a new field.
     */
  }, {
    key: 'addIpAttempt',
    value: function addIpAttempt(ip) {
      var _this3 = this;

      this.ipsAttempts.get(ip, function (err, attempt) {
        if (!attempt) attempt = 1;else attempt++;
        _this3.ipsAttempts.put(ip, attempt, function (err2) {
          if (err2) console.log('ipChecker/addIpAttempt error -> ' + err2);
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
  }, {
    key: 'removeIpAttempts',
    value: function removeIpAttempts(ip) {
      var _this4 = this;

      this.ipsAttempts.get(ip, function (err, attempt) {
        if (attempt) _this4.ipsAttempts.del(ip, function (err2) {
          if (err2) console.log('ipChecker/removeIpAttempts error -> ' + err2);
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
  }, {
    key: 'isTimeout',
    value: function isTimeout(ip, callback) {
      var _this5 = this;

      this.ipsTimeout.get(ip, function (err, value) {
        if (!value) {
          callback(false);
        } else if (new Date() < Date.parse(value)) {
          callback(true);
        } else {
          _this5.ipsTimeout.del(ip, function (err2) {
            if (err2) console.log('ipChecker/isTimeout error -> ' + err2);
          });
          _this5.ipsAttempts.del(ip, function (err2) {
            if (err2) console.log('ipChecker/isTimeout error -> ' + err2);
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
  }, {
    key: 'addIpTimeout',
    value: function addIpTimeout(ip, time, callback) {
      var timeout = new Date();
      timeout.setMilliseconds(timeout.getMilliseconds() + time);
      this.ipsTimeout.put(ip, timeout, function (err) {
        if (err) console.log('ipChecker/addIpTimeout error -> ' + err);
      });
      this.ipsAttempts.put(ip, this.attempts, function (err) {
        if (err) console.log('ipChecker/addIpTimeout error -> ' + err);
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
  }, {
    key: 'removeIpTimeout',
    value: function removeIpTimeout(ip) {
      var _this6 = this;

      this.ipsTimeout.get(ip, function (err, value) {
        if (value) _this6.ipsTimeout.del(ip, function (err2) {
          if (err2) console.log('ipChecker/removeIpTimeout error -> ' + err2);
        });
      });
    }
  }]);

  return IpChecker;
})();

exports['default'] = IpChecker;
module.exports = exports['default'];
