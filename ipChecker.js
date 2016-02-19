/*
 * Project: IpChecker
 * Version: 1.2.0
 * Author: delvedor
 * Twitter: @delvedor
 * License: GNU GPLv2
 * GitHub: https://github.com/delvedor/ipChecker
 */

'use strict'

const level = require('level')

module.exports = class IpChecker {
  constructor (time, attempts, showErrors) {
    if (time) this.checkType(time, 'number')
    if (attempts) this.checkType(attempts, 'number')
    if (showErrors !== undefined) this.checkType(showErrors, 'boolean')

    this.time = time || 1000 * 60 * 10 // time before timeout, default to 10 mins
    this.attempts = attempts || 4// max amount of attempts, default value is 4
    this.showErrors = showErrors || false// toggle erros log, default to false
    this.ipCheckerDB = level('.ipCheckerDB', {valueEncoding: 'json'}) // ipChecker Database
  }

  /**
   *  setTime
   *  @param {Number} time  [timeout time]
   *
   *  Sets the timeout time.
   */
  setTime (time) {
    if (time) this.checkType(time, 'number')

    this.time = time || 1000 * 60 * 10
    return this
  }

  /**
   *  setAttempts
   *  @param {Number} attempts  [max number of attempts]
   *
   *  Sets the maximum number of attempts.
   */
  setAttempts (attempts) {
    if (attempts) this.checkType(attempts, 'number')

    this.attempts = attempts || 4
    return this
  }

  /**
   *  setShowErrors
   *  @param {Boolean} showErrors  [show errors]
   *
   *  Toggles errors log
   */
  setShowErrors (showErrors) {
    if (showErrors !== undefined) this.checkType(showErrors, 'boolean')

    this.showErrors = showErrors || false
    return this
  }

  /**
   *  addAttempt
   *  @param {String} ip  [ip address of the request]
   *
   *  This function adds an attempt to a given client.
   */
  addAttempt (ip) {
    this.checkType(ip, 'string')

    this.getClient(ip, (client) => {
      client = client || {timeout: null, attempts: null}
      client.attempts = (client.attempts ? client.attempts + 1 : 1)
      this.ipCheckerDB.put(ip, client, (err) => {
        if (this.showErrors) console.log(`ipChecker/addAttempt error -> ${err}`)
      })
    })
    return this
  }

  /**
   *  removeAttempts
   *  @param {String} ip  [ip address of the request]
   *
   *  This function removes all the attempts of a given client.
   */
  removeAttempts (ip) {
    this.checkType(ip, 'string')

    this.getClient(ip, (client) => {
      if (!client) return
      client.attempts = null

      this.ipCheckerDB.put(ip, client, (err) => {
        if (this.showErrors) console.log(`ipChecker/removeAttempts error -> ${err}`)
      })
    })
    return this
  }

  /**
   *  addTimeout
   *  @param {String} ip  [ip address of the request]
   *
   * This function adds a timeout to a given client.
   */
  addTimeout (ip) {
    this.checkType(ip, 'string')

    this.getClient(ip, (client) => {
      client = client || {timeout: null, attempts: null}
      let timeout = new Date().getTime()
      client.timeout = timeout + this.time

      this.ipCheckerDB.put(ip, client, (err) => {
        if (this.showErrors) console.log(`ipChecker/addTimeout error -> ${err}`)
      })
    })
    return this
  }

  /**
   *  removeTimeout
   *  @param {String} ip  [ip address of the request]
   *
   *  This function removes the timeout of a given client.
   */
  removeTimeout (ip) {
    this.checkType(ip, 'string')

    this.getClient(ip, (client) => {
      if (!client) return
      client.timeout = null

      this.ipCheckerDB.put(ip, client, (err) => {
        if (this.showErrors) console.log(`ipChecker/removeTimeout error -> ${err}`)
      })
    })
    return this
  }

  /**
   *  getClient
   *  @param {String} ip  [ip address of the request]
   *
   *  This function returns the client and all his data, it returns null if the client is not in the DB.
   */
  getClient (ip, callback) {
    this.checkType(ip, 'string')
    this.checkType(callback, 'function')

    this.ipCheckerDB.get(ip, (err, client) => {
      if (this.showErrors) console.log(err)
      client = client || null
      callback(client)
    })
  }

  /**
   *  checkClient
   *  @param {String}     ip          [ip address of the request]
   *  @param {Function}   callback    [callback]
   *
   *  This function checks (in order):
   *  1) If the given client exist, if not it returns false
   *  2) if the given client has reached the maximum number of attempts, if so it adds a timeout, removes the attempts and returns true
   *  3) if the given client has an active timeout, if so it returns true
   *  4) If none of above, it returns false.
   */
  checkClient (ip, callback) {
    this.checkType(ip, 'string')
    this.checkType(callback, 'function')

    this.getClient(ip, (client) => {
      if (!client) {
        callback(false)
        return
      }
      if (client.attempts >= this.attempts) {
        this.addTimeout(ip)
        this.removeAttempts(ip)
        callback(true)
      } else if (client.timeout) {
        let isTimeout = client.timeout > new Date().getTime()
        if (!isTimeout) this.removeTimeout(ip)
        callback(isTimeout)
      } else {
        callback(false)
      }
    })
  }

  /**
   *  removeClient
   *  @param {String} ip  [ip address of the request]
   *
   *  This function removes a given client from the ipChecker's DB.
   */
  removeClient (ip) {
    this.checkType(ip, 'string')

    this.ipCheckerDB.del(ip, (err) => {
      if (this.showErrors) console.log(`ipChecker/removeAttempts error -> ${err}`)
    })
    return this
  }

  /**
   *  checkType
   *  @param {some variable}  variable  [some variable]
   *  @param {String}         type      [type of the variable]
   *
   *  This functions checks if a variable if of the given type, if not, it throws an error.
   */
  checkType (variable, type) {
    if (typeof variable !== type) throw new Error(`${variable} is not a ${type}`)
  }
}
