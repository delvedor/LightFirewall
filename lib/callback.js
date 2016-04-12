'use strict'

const params = require('./parameters')

/**
 *  addAttempt
 *  @param {String} ip  [ip address of the request]
 *  @param {Function}   callback    [callback]
 *
 *  This function adds an attempt to a given client.
 */
function addAttempt (LightFirewallDB, ip, callback) {
  getClient(LightFirewallDB, ip, (getErr, client) => {
    if (getErr) return callback(getErr)
    client = client || {timeout: null, attempts: null}
    client.attempts = (client.attempts ? client.attempts + 1 : 1)
    LightFirewallDB.put(ip, client, (putErr) => {
      callback(putErr || null)
    })
  })
}

/**
 *  removeAttempts
 *  @param {String} ip  [ip address of the request]
 *  @param {Function}   callback    [callback]
 *
 *  This function removes all the attempts of a given client.
 */
function removeAttempts (LightFirewallDB, ip, callback) {
  getClient(LightFirewallDB, ip, (getErr, client) => {
    if (getErr) return callback(getErr)
    if (!client) return callback(null)
    client.attempts = null

    LightFirewallDB.put(ip, client, (putErr) => {
      callback(putErr || null)
    })
  })
}

/**
 *  addTimeout
 *  @param {String} ip  [ip address of the request]
 *  @param {Number} timeout   [custom timeout in milliseconds]
 *  @param {Function}   callback    [callback]
 *
 * This function adds a timeout to a given client.
 */
function addTimeout (LightFirewallDB, ip, timeout, callback) {
  getClient(LightFirewallDB, ip, (getErr, client) => {
    if (getErr) return callback(getErr)
    client = client || {timeout: null, attempts: null}
    client.timeout = (new Date()).getTime() + (timeout || params.time)

    LightFirewallDB.put(ip, client, (putErr) => {
      callback(putErr || null)
    })
  })
}

/**
 *  removeTimeout
 *  @param {String} ip  [ip address of the request]
 *  @param {Function}   callback    [callback]
 *
 *  This function removes the timeout of a given client.
 */
function removeTimeout (LightFirewallDB, ip, callback) {
  getClient(LightFirewallDB, ip, (getErr, client) => {
    if (getErr) return callback(getErr)
    if (!client) return callback(null)
    client.timeout = null

    LightFirewallDB.put(ip, client, (putErr) => {
      callback(putErr || null)
    })
  })
}

/**
 *  getClient
 *  @param {String} ip  [ip address of the request]
 *
 *  This function returns the client and all his data, it returns null if the client is not in the DB.
 */
function getClient (LightFirewallDB, ip, callback) {
  LightFirewallDB.get(ip, (getErr, client) => {
    return callback(getErr && getErr.notFound ? null : getErr, client || null)
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
function checkClient (LightFirewallDB, ip, callback) {
  getClient(LightFirewallDB, ip, (getErr, client) => {
    if (getErr) return callback(getErr, null)
    // 1)
    if (!client) return callback(null, false)
    // 2)
    if (client.attempts >= params.attempts) {
      client.timeout = (new Date()).getTime() + params.time
      client.attempts = null
      LightFirewallDB.put(ip, client, (putErr) => {
        callback(putErr || null, true)
      })
    // 3)
    } else if (client.timeout) {
      let isTimeout = client.timeout > new Date().getTime()
      if (!isTimeout) {
        client.timeout = null
        LightFirewallDB.put(ip, client, (putErr) => {
          callback(putErr || null, isTimeout)
        })
      } else {
        callback(null, isTimeout)
      }
    // 4)
    } else {
      callback(null, false)
    }
  })
}

/**
 *  removeClient
 *  @param {String} ip  [ip address of the request]
 *  @param {Function}   callback    [callback]
 *
 *  This function removes a given client from the LightFirewall's DB.
 */
function removeClient (LightFirewallDB, ip, callback) {
  LightFirewallDB.del(ip, (delErr) => {
    callback(delErr || null)
  })
}

exports.addAttempt = addAttempt
exports.removeAttempts = removeAttempts
exports.addTimeout = addTimeout
exports.removeTimeout = removeTimeout
exports.getClient = getClient
exports.checkClient = checkClient
exports.removeClient = removeClient
