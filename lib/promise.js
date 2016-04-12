'use strict'

const params = require('./parameters')

/**
 *  addAttempt
 *  @param {String} ip  [ip address of the request]
 *  @return {Promise}
 *
 *  params function adds an attempt to a given client.
 */
function addAttempt (LightFirewallDB, ip) {
  let promise = new Promise((resolve, reject) => {
    LightFirewallDB.get(ip, (getErr, client) => {
      if (getErr && !getErr.notFound) return reject(getErr)
      client = client || {timeout: null, attempts: null}
      client.attempts = (client.attempts ? client.attempts + 1 : 1)

      LightFirewallDB.put(ip, client, (putErr) => {
        putErr ? reject(putErr) : resolve()
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
 *  params function removes all the attempts of a given client.
 */
function removeAttempts (LightFirewallDB, ip) {
  let promise = new Promise((resolve, reject) => {
    LightFirewallDB.get(ip, (getErr, client) => {
      if (getErr && !getErr.notFound) return reject(getErr)
      if (!client) return resolve(null)
      client.attempts = null

      LightFirewallDB.put(ip, client, (putErr) => {
        putErr ? reject(putErr) : resolve()
      })
    })
  })
  return promise
}

/**
 *  addTimeout
 *  @param {String} ip        [ip address of the request]
 *  @param {Number} timeout   [custom timeout in milliseconds]
 *  @return {Promise}
 *
 * params function adds a timeout to a given client.
 */
function addTimeout (LightFirewallDB, ip, timeout) {
  let promise = new Promise((resolve, reject) => {
    LightFirewallDB.get(ip, (getErr, client) => {
      if (getErr && !getErr.notFound) return reject(getErr)
      client = client || {timeout: null, attempts: null}
      client.timeout = (new Date()).getTime() + (timeout || params.time)

      LightFirewallDB.put(ip, client, (putErr) => {
        putErr ? reject(putErr) : resolve()
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
 *  params function removes the timeout of a given client.
 */
function removeTimeout (LightFirewallDB, ip) {
  let promise = new Promise((resolve, reject) => {
    LightFirewallDB.get(ip, (getErr, client) => {
      if (getErr && !getErr.notFound) return reject(getErr)
      client.timeout = null

      LightFirewallDB.put(ip, client, (putErr) => {
        putErr ? reject(putErr) : resolve()
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
 *  params function returns the client and all his data, it returns null if the client is not in the DB.
 */
function getClient (LightFirewallDB, ip) {
  let promise = new Promise((resolve, reject) => {
    LightFirewallDB.get(ip, (getErr, client) => {
      getErr && !getErr.notFound ? resolve(getErr) : resolve(client)
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
 *  params function checks (in order):
 *  1) If the given client exist, if not it returns false
 *  2) if the given client has reached the maximum number of attempts, if so it adds a timeout, removes the attempts and returns true
 *  3) if the given client has an active timeout, if so it returns true
 *  4) If none of above, it returns false.
 */
function checkClient (LightFirewallDB, ip) {
  let promise = new Promise((resolve, reject) => {
    LightFirewallDB.get(ip, (getErr, client) => {
      if (getErr && !getErr.notFound) return reject(getErr)
      // 1)
      if (!client) {
        resolve(false)
      // 2)
      } else if (client.attempts >= params.attempts) {
        client.timeout = (new Date()).getTime() + params.time
        client.attempts = null
        LightFirewallDB.put(ip, client, (putErr) => {
          putErr ? reject(putErr) : resolve(true)
        })
      // 3)
      } else if (client.timeout) {
        let isTimeout = client.timeout > new Date().getTime()
        if (!isTimeout) {
          client.timeout = null
          LightFirewallDB.put(ip, client, (putErr) => {
            putErr ? reject(putErr) : resolve(isTimeout)
          })
        } else {
          resolve(isTimeout)
        }
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
 *  params function removes a given client from the LightFirewall's DB.
 */
function removeClient (LightFirewallDB, ip) {
  let promise = new Promise((resolve, reject) => {
    LightFirewallDB.del(ip, (delErr) => {
      delErr ? reject(delErr) : resolve()
    })
  })
  return promise
}

exports.addAttempt = addAttempt
exports.removeAttempts = removeAttempts
exports.addTimeout = addTimeout
exports.removeTimeout = removeTimeout
exports.getClient = getClient
exports.checkClient = checkClient
exports.removeClient = removeClient
