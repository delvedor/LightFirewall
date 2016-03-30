/*
 * Project: LightFirewall
 * Version: 2.2.0
 * Author: delvedor
 * Twitter: @delvedor
 * License: MIT
 * GitHub: https://github.com/delvedor/LightFirewall
 */

'use strict'

const test = require('tape')
const execSync = require('child_process').execSync
const LightFirewall = require('../LightFirewall.js')
const lfParams = require('../lib/parameters.js')

execSync('rm -rf .LightFirewallDBCallback')

const lf = new LightFirewall(null, null, '.LightFirewallDBCallback')
const ip = '::1'

test('Testing callback function addAttempt()', (t) => {
  t.plan(1)
  lf.addAttempt(ip, (err, client) => {
    if (err) console.log(err)
  })
  setTimeout(() => {
    lf.getClient(ip, (err, client) => {
      if (err) console.log(err)
      if (client.attempts === 1) {
        t.ok(1, 'addAttempt() callback works correctly!')
      } else {
        t.notok(1, 'addAttempt() callback didn\'t work correctly')
      }
    })
  }, 100)
})

test('Testing callback function removeAttempts()', (t) => {
  t.plan(1)
  lf.removeAttempts(ip, (err, client) => {
    if (err) console.log(err)
  })
  setTimeout(() => {
    lf.getClient(ip, (err, client) => {
      if (err) console.log(err)
      if (!client.attempts) {
        t.ok(true, 'removeAttempts() callback works correctly!')
      } else {
        t.notok(true, 'removeAttempts() callback didn\'t work correctly')
      }
    })
  }, 100)
})

test('Testing callback function addTimeout()', (t) => {
  t.plan(2)
  lf.addTimeout(ip, (err) => {
    if (err) console.log(err)
  })
  lf.addTimeout('::2', 100000, (err) => {
    if (err) console.log(err)
  })
  setTimeout(() => {
    lf.getClient(ip, (err, client) => {
      if (err) console.log(err)
      let time = (new Date()).getTime() + lfParams.time
      if (client.timeout && typeof client.timeout === 'number' && client.timeout <= time) {
        t.ok(true, 'addTimeout() callback works correctly!')
      } else {
        t.notok(true, 'addTimeout() callback didn\'t work correctly')
      }
    })
    lf.getClient('::2', (err, client) => {
      if (err) console.log(err)
      let time = (new Date()).getTime() + 100000
      if (client.timeout <= time) {
        t.ok(true, 'addTimeout() callback custom works correctly!')
      } else {
        t.notok(true, 'addTimeout() callback custom didn\'t work correctly')
      }
    })
  }, 100)
})

test('Testing callback function removeTimeout()', (t) => {
  t.plan(2)
  lf.removeTimeout(ip, (err) => {
    if (err) console.log(err)
  })
  lf.removeTimeout('::2', (err) => {
    if (err) console.log(err)
  })
  setTimeout(() => {
    lf.getClient(ip, (err, client) => {
      if (err) console.log(err)
      if (!client.timeout) {
        t.ok(true, 'removeTimeout() callback works correctly!')
      } else {
        t.notok(true, 'removeTimeout() callback didn\'t work correctly')
      }
    })
    lf.getClient('::2', (err, client) => {
      if (err) console.log(err)
      if (!client.timeout) {
        t.ok(true, 'removeTimeout() callback custom works correctly!')
      } else {
        t.notok(true, 'removeTimeout() callback custom didn\'t work correctly')
      }
    })
  }, 100)
})

test('Testing callback function getClient()', (t) => {
  t.plan(2)
  lf.getClient('::3', (err, client) => {
    if (err) console.log(err)
    if (client === null) {
      t.ok(true, 'getClient() callback - empty works correctly!')
    } else {
      t.notok(true, 'getClient() callback - empty didn\'t work correctly')
    }
  })

  lf.getClient(ip, (err, client) => {
    if (err) console.log(err)
    if (client) {
      t.ok(true, 'getClient() callback - empty works correctly!')
    } else {
      t.notok(true, 'getClient() callback - empty didn\'t work correctly')
    }
  })
})

test('Testing callback function checkClient()', (t) => {
  t.plan(4)
  lf.checkClient('::3', (err, bool) => {
    if (err) console.log(err)
    if (!bool) {
      t.ok(true, 'checkClient() callback - client not exist works correctly!')
    } else {
      t.notok(true, 'checkClient() callback - client not exist didn\'t work correctly')
    }
  })

  lf.LightFirewallDB.put(ip, {timeout: null, attempts: 4}, (err) => {
    if (err) console.log(err)
    lf.setTime(-1000 * 60 * 10)
    lf.checkClient(ip, (err1, bool) => {
      if (err1) console.log(err1)
      if (bool) {
        t.ok(true, 'checkClient() callback - client max attempts works correctly!')
      } else {
        t.notok(true, 'checkClient() callback - client max attempts didn\'t work correctly')
      }
      lf.checkClient(ip, (err2, bool) => {
        if (err2) console.log(err2)
        if (!bool) {
          t.ok(true, 'checkClient() callback - isTimeout works correctly!')
        } else {
          t.notok(true, 'checkClient() callback - isTimeout didn\'t work correctly')
        }
      })
    })
  })

  lf.checkClient('::2', (err, bool) => {
    if (err) console.log(err)
    if (!bool) {
      t.ok(true, 'checkClient() callback - else works correctly!')
    } else {
      t.notok(true, 'checkClient() callback - else didn\'t work correctly')
    }
  })
})

test('Testing callback function removeClient()', (t) => {
  t.plan(1)
  lf.removeClient(ip, (err) => {
    if (err) console.log(err)
    lf.getClient(ip, (err1, client) => {
      if (err1) console.log(err1)
      if (client === null) {
        t.ok(true, 'removeClient() callback works correctly!')
      } else {
        t.notok(true, 'removeClient() callback didn\'t work correctly')
      }
      execSync('rm -rf .LightFirewallDBCallback')
    })
  })
})
