/*
 * Project: LightFirewall
 * Version: 1.3.0
 * Author: delvedor
 * Twitter: @delvedor
 * License: GNU GPLv2
 * GitHub: https://github.com/delvedor/LightFirewall
 */

'use strict'

const level = require('level')

module.exports = class LightFirewall {
  constructor (time, attempts, showErrors) {
    if (time) this.checkType(time, 'number')
    if (attempts) this.checkType(attempts, 'number')
    if (showErrors !== undefined) this.checkType(showErrors, 'boolean')

    this.time = time || 1000 * 60 * 10 // time before timeout, default to 10 mins
    this.attempts = attempts || 4// max amount of attempts, default value is 4
    this.showErrors = showErrors || false// toggle erros log, default to false
    this.LightFirewallDB = level('.LightFirewallDB', {valueEncoding: 'json'}) // LightFirewall Database
  }

  /**
   *  setTime
   *  @param {Number} time  [timeout time]
   *  @return {LightFirewall}
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
   *  @return {LightFirewall}
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
   *  @return {LightFirewall}
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
   *  @return {Promise}
   *
   *  This function adds an attempt to a given client.
   */
  addAttempt (ip) {
    this.checkType(ip, 'string')

    let promise = new Promise((resolve, reject) => {
      this.LightFirewallDB.get(ip, (getErr, client) => {
        if (this.showErrors) console.log(getErr)
        client = client || {timeout: null, attempts: null}
        client.attempts = (client.attempts ? client.attempts + 1 : 1)

        this.LightFirewallDB.put(ip, client, (putErr) => {
          if (this.showErrors) console.log(putErr)
          if (putErr) {
            reject(putErr)
          } else {
            resolve()
          }
        })
      })
    })
    return promise
  }

  /**
   *  removeAttempts
   *  @param {String} ip  [ip address of the request]
   *  @return {Promise}
   *
   *  This function removes all the attempts of a given client.
   */
  removeAttempts (ip) {
    this.checkType(ip, 'string')

    let promise = new Promise((resolve, reject) => {
      this.LightFirewallDB.get(ip, (getErr, client) => {
        if (this.showErrors) console.log(getErr)
        if (!client) {
          // reject(getErr)
          resolve(null)
          return
        }
        client.attempts = null

        this.LightFirewallDB.put(ip, client, (putErr) => {
          if (this.showErrors) console.log(putErr)
          if (putErr) {
            reject(putErr)
          } else {
            resolve()
          }
        })
      })
    })
    return promise
  }

  /**
   *  addTimeout
   *  @param {String} ip        [ip address of the request]
   *  @param {Number} timeout   [custom timeout]
   *  @return {Promise}
   *
   * This function adds a timeout to a given client.
   */
  addTimeout (ip, timeout) {
    this.checkType(ip, 'string')
    if (timeout) this.checkType(timeout, 'number')

    let promise = new Promise((resolve, reject) => {
      this.LightFirewallDB.get(ip, (getErr, client) => {
        if (this.showErrors) console.log(getErr)
        client = client || {timeout: null, attempts: null}
        client.timeout = timeout || (new Date()).getTime() + this.time

        this.LightFirewallDB.put(ip, client, (putErr) => {
          if (this.showErrors) console.log(putErr)
          if (putErr) {
            reject(putErr)
          } else {
            resolve()
          }
        })
      })
    })
    return promise
  }

  /**
   *  removeTimeout
   *  @param {String} ip  [ip address of the request]
   *  @return {Promise}
   *
   *  This function removes the timeout of a given client.
   */
  removeTimeout (ip) {
    this.checkType(ip, 'string')

    let promise = new Promise((resolve, reject) => {
      this.LightFirewallDB.get(ip, (getErr, client) => {
        if (this.showErrors) console.log(getErr)
        if (!client) {
          // reject(getErr)
          resolve(null)
          return
        }
        client.timeout = null

        this.LightFirewallDB.put(ip, client, (putErr) => {
          if (this.showErrors) console.log(putErr)
          if (putErr) {
            reject(putErr)
          } else {
            resolve()
          }
        })
      })
    })
    return promise
  }

  /**
   *  getClient
   *  @param {String} ip  [ip address of the request]
   *  @return {Promise}
   *
   *  This function returns the client and all his data, it returns null if the client is not in the DB.
   */
  getClient (ip) {
    this.checkType(ip, 'string')

    let promise = new Promise((resolve, reject) => {
      this.LightFirewallDB.get(ip, (getErr, client) => {
        if (this.showErrors) console.log(getErr)
        if (getErr) {
          // reject(getErr)
          resolve(null)
        } else {
          resolve(client)
        }
      })
    })
    return promise
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
  checkClient (ip) {
    this.checkType(ip, 'string')

    let promise = new Promise((resolve, reject) => {
      this.LightFirewallDB.get(ip, (getErr, client) => {
        if (this.showErrors) console.log(getErr)
        // 1)
        if (!client) {
          resolve(false)
        // 2)
        } else if (client.attempts >= this.attempts) {
          this.addTimeout(ip)
            .then(() => {
              return this.removeAttempts(ip)
            })
            .then(() => {
              resolve(true)
            })
            .catch((err) => {
              console.log(err)
            })
        // 3)
        } else if (client.timeout) {
          let isTimeout = client.timeout > new Date().getTime()
          if (!isTimeout) this.removeTimeout(ip)
          resolve(isTimeout)
        // 4)
        } else {
          resolve(false)
        }
      })
    })
    return promise
  }

  /**
   *  removeClient
   *  @param {String} ip  [ip address of the request]
   *  @return {Promise}
   *
   *  This function removes a given client from the LightFirewall's DB.
   */
  removeClient (ip) {
    this.checkType(ip, 'string')

    let promise = new Promise((resolve, reject) => {
      this.LightFirewallDB.del(ip, (delErr) => {
        if (this.showErrors) console.log(delErr)
        if (delErr) {
          reject(delErr)
        } else {
          resolve()
        }
      })
    })
    return promise
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
