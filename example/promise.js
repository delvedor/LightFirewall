/*
 * Project: LightFirewall
 * Version: 2.2.1
 * Author: delvedor
 * Twitter: @delvedor
 * License: MIT
 * GitHub: https://github.com/delvedor/LightFirewall
 */

'use strict'

const http = require('http')
const LightFirewall = require('../LightFirewall.js')
const requestIp = require('request-ip')

const lf = new LightFirewall(1000 * 10, 3, false)

http.createServer((request, response) => {
  // gets the ip of the request
  let ip = requestIp.getClientIp(request)

  // this snippet closes the request to favicon.ico
  if (request.url === '/favicon.ico') {
    response.end()
    console.log('favicon requested')
    return
  }

  // here we add an attempt to the ip
  lf.addAttempt(ip)
    .then(() => {
      // here we check if the client has reached the maximum number of attempts
      // or if the client has an active timeout
      return lf.checkClient(ip)
    })
    .then((client) => {
      if (!client) {
        console.log('Request accepted')
        response.writeHead(200, {'Content-Type': 'text/plain'})
        response.end('Hello World\n')
      } else {
        console.log('Access denied')
        response.writeHead(403, {'Content-Type': 'text/plain'})
        response.end('Access denied\n')
      }
    })
    .catch((err) => {
      console.log(err)
    })
}).listen(8080)

console.log('Server running at http://127.0.0.1:8080/')
