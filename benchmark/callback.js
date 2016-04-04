'use strict'

const bench = require('fastbench')
const execSync = require('child_process').execSync
const LightFirewall = require('../LightFirewall.js')

execSync('rm -rf .LightFirewallDBCallback')
const lf = new LightFirewall(null, null, '.LightFirewallDBCallback')
const ip = '::1'

let run = bench([
  function addAttempt (done) {
    lf.addAttempt(ip, (err) => {
      if (err) console.log(err)
      done()
    })
  },
  function removeAttempts (done) {
    lf.removeAttempts(ip, (err) => {
      if (err) console.log(err)
      done()
    })
  },
  function addTimeout (done) {
    lf.addTimeout(ip, (err) => {
      if (err) console.log(err)
      done()
    })
  },
  function addTimeoutCustom (done) {
    lf.addTimeout(ip, 10000, (err) => {
      if (err) console.log(err)
      done()
    })
  },
  function removeTimeout (done) {
    lf.removeTimeout(ip, (err) => {
      if (err) console.log(err)
      done()
    })
  },
  function getClient (done) {
    lf.getClient(ip, (err, client) => {
      if (err) console.log(err)
      done()
    })
  },
  function checkClient (done) {
    lf.checkClient(ip, (err, bool) => {
      if (err) console.log(err)
      done()
    })
  },
  function removeClient (done) {
    lf.removeClient(ip, (err) => {
      if (err) console.log(err)
      done()
    })
  }
], 1000)

console.log('Benchmarking Callback implementation:')
run(run)
execSync('rm -rf .LightFirewallDBCallback')
