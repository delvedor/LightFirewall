'use strict'

const bench = require('fastbench')
const execSync = require('child_process').execSync
const LightFirewall = require('../LightFirewall.js')

execSync('rm -rf .LightFirewallDBPromise')
const lf = new LightFirewall(null, null, '.LightFirewallDBPromise')
const ip = '::1'

let run = bench([
  function addAttempt (done) {
    lf.addAttempt(ip)
      .then(() => {
        done()
      })
      .catch((err) => {
        console.log(err)
      })
  },
  function removeAttempts (done) {
    lf.removeAttempts(ip)
      .then(() => {
        done()
      })
      .catch((err) => {
        console.log(err)
      })
  },
  function addTimeout (done) {
    lf.addTimeout(ip)
      .then(() => {
        done()
      })
      .catch((err) => {
        console.log(err)
      })
  },
  function addTimeoutCustom (done) {
    lf.addTimeout(ip, 10000)
      .then(() => {
        done()
      })
      .catch((err) => {
        console.log(err)
      })
  },
  function removeTimeout (done) {
    lf.removeTimeout(ip)
      .then(() => {
        done()
      })
      .catch((err) => {
        console.log(err)
      })
  },
  function getClient (done) {
    lf.getClient(ip)
      .then((client) => {
        done()
      })
      .catch((err) => {
        console.log(err)
      })
  },
  function checkClient (done) {
    lf.checkClient(ip)
      .then((bool) => {
        done()
      })
      .catch((err) => {
        console.log(err)
      })
  },
  function removeClient (done) {
    lf.removeClient(ip)
      .then(() => {
        done()
      })
      .catch((err) => {
        console.log(err)
      })
  }
], 1000)

console.log('Benchmarking Promise implementation:')
run(run)
execSync('rm -rf .LightFirewallDBPromise')
