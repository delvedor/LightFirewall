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

execSync('rm -rf .LightFirewallDB')

const lf = new LightFirewall(null, null, '.LightFirewallDB')

test('Testing promise function setTime()', (t) => {
  t.plan(1)
  let time = Math.floor(Math.random() * 1000) + 1
  lf.setTime(time)
  if (lfParams.time === time) {
    t.ok(time, 'Time was correctly changed!')
  } else {
    t.notok(time, 'Time was not correctly changed! :(')
  }
})

test('Testing promise function setAttempts()', (t) => {
  t.plan(1)
  let attempts = Math.floor(Math.random() * 6) + 1
  lf.setAttempts(attempts)
  if (lfParams.attempts === attempts) {
    t.ok(attempts, 'Attempts were correctly changed!')
  } else {
    t.notok(attempts, 'Attempts were not correctly changed! :(')
  }
  execSync('rm -rf .LightFirewallDB')
})
