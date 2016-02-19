/*
 * Project: IpChecker
 * Version: 1.2.0
 * Author: delvedor
 * Twitter: @delvedor
 * License: GNU GPLv2
 * GitHub: https://github.com/delvedor/ipChecker
 */

'use strict'

const test = require('tape')
const execSync = require('child_process').execSync
const IpChecker = require('./ipChecker.js')

execSync('rm -rf .ipCheckerDB')

const ipc = new IpChecker()
const ip = '::1'

test('Testing function setTime()', (t) => {
  t.plan(1)
  let time = Math.floor(Math.random() * 1000) + 1
  ipc.setTime(time)
  if (ipc.time === time) {
    t.ok(time, 'Time was correctly changed!')
  } else {
    t.notok(time, 'Time was not correctly changed! :(')
  }
})

test('Testing function setAttempts()', (t) => {
  t.plan(1)
  let attempts = Math.floor(Math.random() * 6) + 1
  ipc.setAttempts(attempts)
  if (ipc.attempts === attempts) {
    t.ok(attempts, 'Attempts were correctly changed!')
  } else {
    t.notok(attempts, 'Attempts were not correctly changed! :(')
  }
})

test('Testing function setShowErrors()', (t) => {
  t.plan(1)
  ipc.setShowErrors(true)
  if (ipc.showErrors === true) {
    t.ok(true, 'showErrors was correctly changed!')
  } else {
    t.notok(true, 'showErrors was not correctly changed! :(')
  }
})

test('Testing function addAttempt()', (t) => {
  // Restore to default values
  ipc.setTime(1000 * 60 * 10).setAttempts(4).setShowErrors(false)

  t.plan(1)
  ipc.addAttempt(ip)
  setTimeout(() => {
    ipc.getClient(ip, (client) => {
      if (client.attempts === 1) {
        t.ok(1, 'addAttempt() works correctly!')
      } else {
        t.notok(1, 'addAttempt() didn\' work correctly')
      }
    })
  }, 20)
})

test('Testing function removeAttempts()', (t) => {
  t.plan(1)
  ipc.removeAttempts(ip)
  setTimeout(() => {
    ipc.getClient(ip, (client) => {
      if (!client.attempts) {
        t.ok(true, 'removeAttempts() works correctly!')
      } else {
        t.notok(true, 'removeAttempts() didn\' work correctly')
      }
    })
  }, 20)
})

test('Testing function addTimeout()', (t) => {
  t.plan(1)
  ipc.addTimeout(ip)
  setTimeout(() => {
    ipc.getClient(ip, (client) => {
      if (client.timeout && typeof client.timeout === 'number') {
        t.ok(true, 'addTimeout() works correctly!')
      } else {
        t.notok(true, 'addTimeout() didn\' work correctly')
      }
    })
  }, 20)
})

test('Testing function removeTimeout()', (t) => {
  t.plan(1)
  ipc.removeTimeout(ip)
  setTimeout(() => {
    ipc.getClient(ip, (client) => {
      if (!client.timeout) {
        t.ok(true, 'removeTimeout() works correctly!')
      } else {
        t.notok(true, 'removeTimeout() didn\' work correctly')
      }
    })
  }, 20)
})

test('Testing function getClient()', (t) => {
  t.plan(2)
  ipc.getClient('::2', (client) => {
    if (!client) {
      t.ok(true, 'getClient() - empty works correctly!')
    } else {
      t.notok(true, 'getClient() - empty didn\'t work correctly')
    }
  })
  ipc.getClient(ip, (client) => {
    if (client) {
      t.ok(true, 'getClient() - full works correctly!')
    } else {
      t.notok(true, 'getClient() - full didn\'t work correctly')
    }
  })
})

test('Testing function checkClient()', (t) => {
  t.plan(4)
  ipc.checkClient('::2', (client) => {
    if (!client) {
      t.ok(true, 'checkClient() - client not exist works correctly!')
    } else {
      t.notok(true, 'checkClient() - client not exist didn\'t work correctly')
    }
  })

  // adds 4 attempts to ip
  for (let i = 10; i <= 40; i = i + 10) {
    setTimeout(() => { ipc.addAttempt('::2') }, i)
  }

  // sets the time in negative for testing the checkClient isTimeout
  ipc.setTime(-1000 * 60 * 10)

  setTimeout(() => {
    ipc.checkClient('::2', (client) => {
      if (client) {
        t.ok(true, 'checkClient() - max attempts works correctly!')
      } else {
        t.notok(true, 'checkClient() - max attempts didn\'t work correctly')
      }
    })
  }, 500)

  setTimeout(() => {
    ipc.checkClient('::2', (client) => {
      if (!client) {
        t.ok(true, 'checkClient() - isTimeout works correctly!')
      } else {
        t.notok(true, 'checkClient() - isTimeout didn\'t work correctly')
      }
    })
  }, 1000)

  setTimeout(() => {
    ipc.checkClient('::2', (client) => {
      if (!client) {
        t.ok(true, 'checkClient() - else works correctly!')
      } else {
        t.notok(true, 'checkClient() - else didn\'t work correctly')
      }
    })
  }, 1500)
})

test('Testing function removeClient()', (t) => {
  t.plan(1)
  ipc.removeClient(ip)
  setTimeout(() => {
    ipc.getClient(ip, (client) => {
      if (!client) {
        t.ok(true, 'removeClient() works correctly!')
      } else {
        t.notok(true, 'removeClient() didn\'t work correctly')
      }
    })
    execSync('rm -rf .ipCheckerDB')
  }, 20)
})
