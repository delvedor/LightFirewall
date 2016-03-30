/*
 * Project: LightFirewall
 * Version: 2.2.0
 * Author: delvedor
 * Twitter: @delvedor
 * License: MIT
 * GitHub: https://github.com/delvedor/LightFirewall
 */

'use strict'

const level = require('level')
const promise = require('./lib/promise')
const callback = require('./lib/callback')
const parameters = require('./lib/parameters')

module.exports = class LightFirewall {
  constructor (time, attempts, dbName) {
    if (time) checkType(time, 'number')
    if (attempts) checkType(attempts, 'number')
    if (dbName) checkType(dbName, 'string')

    parameters.time = time || 1000 * 60 * 10 // time before timeout, default to 10 mins
    parameters.attempts = attempts || 4 // max amount of attempts, default value is 4
    dbName = dbName || '.LightFirewallDB' // custom name of LightFirewall DB, default to .LightFirewallDB
    this.LightFirewallDB = level(dbName, {valueEncoding: 'json'}) // LightFirewall Database
  }

  /**
   *  setTime
   *  @param {Number} time  [timeout time]
   *  @return {LightFirewall}
   *
   *  Sets the timeout time.
   */
  setTime (time) {
    if (time) checkType(time, 'number')

    parameters.time = time || 1000 * 60 * 10
    return this
  }

  /**
   *  setAttempts
   *  @param {Number} attempts  [max number of attempts]
   *  @return {LightFirewall}
   *
   *  Sets the maximum number of attempts.
   */
  setAttempts (attempts) {
    if (attempts) checkType(attempts, 'number')

    parameters.attempts = attempts || 4
    return this
  }

  /**
   *  addAttempt
   *  @param {String} ip  [ip address of the request]
   *  @return {Promise}
   *
   *  This function adds an attempt to a given client.
   */
  addAttempt (ip, cb) {
    checkType(ip, 'string')
    if (cb) {
      checkType(cb, 'function')
      return callback.addAttempt(this.LightFirewallDB, ip, cb)
    }
    return promise.addAttempt(this.LightFirewallDB, ip)
  }

  /**
   *  removeAttempts
   *  @param {String} ip  [ip address of the request]
   *  @return {Promise}
   *
   *  This function removes all the attempts of a given client.
   */
  removeAttempts (ip, cb) {
    checkType(ip, 'string')
    if (cb) {
      checkType(cb, 'function')
      return callback.removeAttempts(this.LightFirewallDB, ip, cb)
    }
    return promise.removeAttempts(this.LightFirewallDB, ip)
  }

  /**
   *  addTimeout
   *  @param {String} ip        [ip address of the request]
   *  @param {Number} timeout   [custom timeout in milliseconds]
   *  @return {Promise}
   *
   * This function adds a timeout to a given client.
   */
  addTimeout (ip, timeout, cb) {
    checkType(ip, 'string')
    if (typeof timeout === 'function') {
      cb = timeout
      timeout = null
    }
    if (timeout) checkType(timeout, 'number')
    if (cb) {
      checkType(cb, 'function')
      return callback.addTimeout(this.LightFirewallDB, ip, timeout, cb)
    }
    return promise.addTimeout(this.LightFirewallDB, ip, timeout)
  }

  /**
   *  removeTimeout
   *  @param {String} ip  [ip address of the request]
   *  @return {Promise}
   *
   *  This function removes the timeout of a given client.
   */
  removeTimeout (ip, cb) {
    checkType(ip, 'string')
    if (cb) {
      checkType(cb, 'function')
      return callback.removeTimeout(this.LightFirewallDB, ip, cb)
    }
    return promise.removeTimeout(this.LightFirewallDB, ip)
  }

  /**
   *  getClient
   *  @param {String} ip  [ip address of the request]
   *  @return {Promise}
   *
   *  This function returns the client and all his data, it returns null if the client is not in the DB.
   */
  getClient (ip, cb) {
    checkType(ip, 'string')
    if (cb) {
      checkType(cb, 'function')
      return callback.getClient(this.LightFirewallDB, ip, cb)
    }
    return promise.getClient(this.LightFirewallDB, ip)
  }

  /**
   *  checkClient
   *  @param {String}     ip          [ip address of the request]
   *  @param {Function}   callback    [callback]
   *  @return {Promise}
   *
   *  This function checks (in order):
   *  1) If the given client exist, if not it returns false
   *  2) if the given client has reached the maximum number of attempts, if so it adds a timeout, removes the attempts and returns true
   *  3) if the given client has an active timeout, if so it returns true
   *  4) If none of above, it returns false.
   */
  checkClient (ip, cb) {
    checkType(ip, 'string')
    if (cb) {
      checkType(cb, 'function')
      return callback.checkClient(this.LightFirewallDB, ip, cb)
    }
    return promise.checkClient(this.LightFirewallDB, ip)
  }

  /**
   *  removeClient
   *  @param {String} ip  [ip address of the request]
   *  @return {Promise}
   *
   *  This function removes a given client from the LightFirewall's DB.
   */
  removeClient (ip, cb) {
    checkType(ip, 'string')
    if (cb) {
      checkType(cb, 'function')
      return callback.removeClient(this.LightFirewallDB, ip, cb)
    }
    return promise.removeClient(this.LightFirewallDB, ip)
  }
}

/**
 *  checkType
 *  @param {some variable}  variable  [some variable]
 *  @param {String}         type      [type of the variable]
 *
 *  This functions checks if a variable if of the given type, if not, it throws an error.
 */
function checkType (variable, type) {
  if (typeof variable !== type) throw new Error(`${variable} is not a ${type}`)
}
