'use strict'

const http = require('http')
const requestIp = require('request-ip')
const request = require('request')
const execSync = require('child_process').execSync
const test = require('tape')

const LightFirewall = require('../../LightFirewall.js')
const lf = new LightFirewall(1000 * 10, 3, '.LightFirewallDBServerCallback')

const server = http.createServer((request, response) => {
  // gets the ip of the request
  let ip = requestIp.getClientIp(request)

  // this snippet closes the request to favicon.ico
  if (request.url === '/favicon.ico') return response.end()

  // here we add an attempt to the ip
  lf.addAttempt(ip, (errAdd) => {
    if (errAdd) return console.log(errAdd)
    // here we check if the client has reached the maximum number of attempts
    // or if the client has an active timeout
    lf.checkClient(ip, (errCheck, client) => {
      if (errCheck) return console.log(errCheck)
      if (!client) {
        response.writeHead(200, {'Content-Type': 'text/plain'})
        response.end('Hello World\n')
      } else {
        response.writeHead(403, {'Content-Type': 'text/plain'})
        response.end('Access denied\n')
      }
    })
  })
}).listen(8080)

test('Test server callback #1', (t) => {
  t.plan(2)
  request('http://127.0.0.1:8080', function (err, response, body) {
    if (err) console.log(err)
    t.equal(response.statusCode, 200, `Status code: ${response.statusCode}`)
    t.equal(body, 'Hello World\n', `Body: ${body}`)
  })
})

test('Test server callback #2', (t) => {
  t.plan(2)
  request('http://127.0.0.1:8080', function (err, response, body) {
    if (err) console.log(err)
    t.equal(response.statusCode, 200, `Status code: ${response.statusCode}`)
    t.equal(body, 'Hello World\n', `Body: ${body}`)
  })
})

test('Test server callback #3', (t) => {
  t.plan(2)
  request('http://127.0.0.1:8080', function (err, response, body) {
    if (err) console.log(err)
    t.equal(response.statusCode, 403, `Status code: ${response.statusCode}`)
    t.equal(body, 'Access denied\n', `Body: ${body}`)
  })
})

test('Test server callback #4', (t) => {
  t.plan(2)
  console.log('Wait 11 seconds...')
  setTimeout(() => {
    request('http://127.0.0.1:8080', function (err, response, body) {
      if (err) console.log(err)
      t.equal(response.statusCode, 200, `Status code: ${response.statusCode}`)
      t.equal(body, 'Hello World\n', `Body: ${body}`)
      server.close()
      execSync('rm -rf .LightFirewallDBServerCallback')
    })
  }, 1000 * 11)
})
