/*
 * Project: LightFirewall
 * Version: 2.2.1
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

execSync('rm -rf .LightFirewallDBPromise')

const lf = new LightFirewall(null, null, '.LightFirewallDBPromise')
const ip = '::1'

test('Testing promise function addAttempt()', (t) => {
  // Restore to default values
  lf.setTime(1000 * 60 * 10).setAttempts(4)

  t.plan(1)
  lf.addAttempt(ip)
    .then(() => {
      return lf.getClient(ip)
    })
    .then((client) => {
      if (client.attempts === 1) {
        t.ok(1, 'addAttempt() promise works correctly!')
      } else {
        t.notok(1, 'addAttempt() promise didn\'t work correctly')
      }
    })
    .catch((err) => {
      t.notok(true, 'Something went wrong')
      console.log(err)
    })
})

test('Testing promise function removeAttempts()', (t) => {
  t.plan(1)
  lf.removeAttempts(ip)
    .then(() => {
      return lf.getClient(ip)
    })
    .then((client) => {
      if (!client.attempts) {
        t.ok(true, 'removeAttempts() promise works correctly!')
      } else {
        t.notok(true, 'removeAttempts() promise didn\'t work correctly')
      }
    })
    .catch((err) => {
      t.notok(true, 'Something went wrong')
      console.log(err)
    })
})

test('Testing promise function addTimeout()', (t) => {
  t.plan(2)
  lf.addTimeout(ip)
    .then(() => {
      return lf.getClient(ip)
    })
    .then((client) => {
      let time = (new Date()).getTime() + lfParams.time
      if (client.timeout && typeof client.timeout === 'number' && client.timeout <= time) {
        t.ok(true, 'addTimeout() promise works correctly!')
      } else {
        t.notok(true, 'addTimeout() promise didn\'t work correctly')
      }
      return lf.addTimeout(ip, 100000)
    })
    .then(() => {
      return lf.getClient(ip)
    })
    .then((client) => {
      let time = (new Date()).getTime() + 100000
      if (client.timeout <= time) {
        t.ok(true, 'addTimeout() promise custom works correctly!')
      } else {
        t.notok(true, 'addTimeout() promise custom didn\'t work correctly')
      }
    })
    .catch((err) => {
      t.notok(true, 'Something went wrong')
      console.log(err)
    })
})

test('Testing promise function removeTimeout()', (t) => {
  t.plan(1)
  lf.removeTimeout(ip)
    .then(() => {
      return lf.getClient(ip)
    })
    .then((client) => {
      if (!client.timeout) {
        t.ok(true, 'removeTimeout() promise works correctly!')
      } else {
        t.notok(true, 'removeTimeout() promise didn\'t work correctly')
      }
    })
    .catch((err) => {
      t.notok(true, 'Something went wrong')
      console.log(err)
    })
})

test('Testing promise function getClient()', (t) => {
  t.plan(2)
  lf.getClient('::2')
    .then((client) => {
      if (!client) {
        t.ok(true, 'getClient() promise - empty works correctly!')
      } else {
        t.notok(true, 'getClient() promise - empty didn\'t work correctly')
      }
    })
    .catch((err) => {
      t.notok(true, 'Something went wrong')
      console.log(err)
    })

  lf.getClient(ip)
    .then((client) => {
      if (client) {
        t.ok(true, 'getClient() promise - empty works correctly!')
      } else {
        t.notok(true, 'getClient() promise - empty didn\'t work correctly')
      }
    })
    .catch((err) => {
      t.notok(true, 'Something went wrong')
      console.log(err)
    })
})

test('Testing promise function checkClient()', (t) => {
  t.plan(4)
  lf.checkClient('::2')
    .then((bool) => {
      if (!bool) {
        t.ok(true, 'checkClient() promise - client not exist works correctly!')
      } else {
        t.notok(true, 'checkClient() promise - client not exist didn\'t work correctly')
      }
      // adds 4 attempts to ip
      return lf.addAttempt('::2')
    })
    .then(() => {
      return lf.addAttempt('::2')
    })
    .then(() => {
      return lf.addAttempt('::2')
    })
    .then(() => {
      return lf.addAttempt('::2')
    })
    .then(() => {
      // sets the time in negative for testing the checkClient isTimeout
      lf.setTime(-1000 * 60 * 10)
      return lf.checkClient('::2')
    })
    .then((bool) => {
      if (bool) {
        t.ok(true, 'checkClient() promise - client max attempts works correctly!')
      } else {
        t.notok(true, 'checkClient() promise - client max attempts didn\'t work correctly')
      }
      return lf.checkClient('::2')
    })
    .then((bool) => {
      if (!bool) {
        t.ok(true, 'checkClient() promise - isTimeout works correctly!')
      } else {
        t.notok(true, 'checkClient() promise - isTimeout didn\'t work correctly')
      }
      return lf.checkClient('::2')
    })
    .then((bool) => {
      if (!bool) {
        t.ok(true, 'checkClient() promise - else works correctly!')
      } else {
        t.notok(true, 'checkClient() promise - else didn\'t work correctly')
      }
    })
    .catch((err) => {
      t.notok(true, 'Something went wrong')
      console.log(err)
    })
})

test('Testing promise function removeClient()', (t) => {
  t.plan(1)
  lf.removeClient(ip)
    .then(() => {
      return lf.getClient(ip)
    })
    .then((client) => {
      if (!client) {
        t.ok(true, 'removeClient() promise works correctly!')
      } else {
        t.notok(true, 'removeClient() promise didn\'t work correctly')
      }
      execSync('rm -rf .LightFirewallDBPromise')
    })
    .catch((err) => {
      t.notok(true, 'Something went wrong')
      console.log(err)
      execSync('rm -rf .LightFirewallDBPromise')
    })
})
