# Light Firewall
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
[![AppVersion-version](https://img.shields.io/badge/AppVersion-2.2.0-brightgreen.svg?style=flat)](https://github.com/delvedor/appversion?#version)
[![Build Status](https://travis-ci.org/delvedor/LightFirewall.svg?branch=master)](https://travis-ci.org/delvedor/LightFirewall)

*Formerly known as ipChecker.*  
Light Firewall is a lightweight firewall built for NodeJs.  
It provides some useful tools for the developer to track the number of attempts a client has performed and assigns a timeout after a certain number of attempts decided by the developer, where the client will be "frozen."

It can be used to limit excessive requests to a DB, or to block a client that is making too many requests to a service.  
Here you can find some [examples](https://github.com/delvedor/LightFirewall/tree/master/example).

From the version 1.1.0 Light Firewall doesn't use anymore a JavaScript object for store the ip timeout and the attempts, but uses [LevelDB](https://github.com/Level/levelup).
It creates one hidden folder named *LightFirewallDB* with all the persistent data.

**Needs Node.js >= 4.0.0**

## Usage
Download and install LightFirewall through npm:  
```
npm install light-firewall --save
```  
Then require the module in your code.
```Javascript
// es5
var LightFirewall = require('light-firewall')

// es6 - es2015:
import LightFirewall from 'light-firewall'
```

## API Reference
Here is the list of public API's exposed by the Light Firewall module as well as a brief description of their use and how they work.  
All the functions except for LightFirewall, setTime and setAttempts, return promises or callbacks.

> From LightFirewall 2.2.0, **you can choose** to use the **Promise** or **Callback** implementation.  
> If you want to use the Callback just pass the callback function as parameter, otherwise LightFirewall will automatically run a promise.  
> If you want to use the callback implementation but you have no callbacks, just pass a *noop* function.

- <a href="#LightFirewall">LightFirewall()</a>
- <a href="#setTime">.setTime()</a>
- <a href="#setAttempts">.setAttempts()</a>
- <a href="#setShowErrors">.setShowErrors()</a>
- <a href="#addAttempt">.addAttempt()</a>
- <a href="#removeAttempts">.removeAttempts()</a>
- <a href="#addTimeout">.addTimeout()</a>
- <a href="#removeTimeout">.removeTimeout()</a>
- <a href="#getClient">.getClient()</a>
- <a href="#checkClient">.checkClient()</a>
- <a href="#removeClient">.removeClient()</a>

<a name="LightFirewall"></a>
### LightFirewall(time, attempts, showErrors, dbName)
*@param*  {Number}   **time**  [for how much time Light Firewall must freeze an ip address ( default value: 10 mins )]  
*@param*  {Number}   **attempts**  [how many failed attempts before freeze the ip address (default value: 4)]  
*@param*  {String}   **dbName** [custom name of the LightFirewall DB (default value: .LightFirewallDB)]
```Javascript
// declaration without parameters
const lf = new LightFirewall()
// declaration with parameters
const lf = new LightFirewall((1000 * 10), 2, '.CustomDbName')
```

<a name="setTime"></a>
### setTime(time)
*@param* {Number} **time**  [timeout time]  
*@return* {LightFirewall}  
Sets the timeout time.

<a name="setAttempts"></a>
### setAttempts(attempts)
*@param* {Number} **attempts**  [max number of attempts]  
*@return* {LightFirewall}  
Sets the maximum number of attempts.

<a name="setShowErrors"></a>
### setShowErrors(showErrors)
*@param* {Boolean} **showErrors**  [show errors]  
*@return* {LightFirewall}  
Toggles errors log.

<a name="addAttempt"></a>
### addAttempt(ip)
*@param* {String} **ip**  [ip address of the request]  
*@return* {Promise || Callback}  
This function adds an attempt to a given client.

<a name="removeAttempts"></a>
### removeAttempts(ip)
*@param* {String} **ip**  [ip address of the request]  
*@return* {Promise || Callback}  
This function removes all the attempts of a given client.

<a name="addTimeout"></a>
### addTimeout(ip, timeout)
*@param* {String} **ip**  [ip address of the request]  
*@param* {Number} **timeout**  [custom timeout in milliseconds]  
*@return* {Promise || Callback}  
This function adds a timeout to a given client.

<a name="removeTimeout"></a>
### removeTimeout(ip)
*@param* {String} **ip**  [ip address of the request]  
*@return* {Promise || Callback}  
This function removes the timeout of a given client.

<a name="getClient"></a>
### getClient(ip)
*@param* {String} **ip**  [ip address of the request]  
*@param* {Function}   **callback**    [callback]  
*@return* {Promise || Callback}  
This function returns the client and all his data, it returns null if the client is not in the DB.

<a name="checkClient"></a>
### checkClient(ip)
*@param* {String} **ip**  [ip address of the request]  
*@return* {Promise || Callback}  
This function checks (in order):  
1. If the given client exist, if not it returns false  
2. if the given client has reached the maximum number of attempts, if so it adds a timeout, removes the attempts and returns true  
3. if the given client has an active timeout, if so it returns true  
4. If none of above, it returns false.

<a name="removeClient"></a>
### removeClient(ip)
*@param* {String} **ip**  [ip address of the request]  
*@return* {Promise || Callback}  
This function removes a given client from the Light Firewall's DB.

## Example
```Javascript
// Promise example
const LightFirewall = require('light-firewall')
const lf = new LightFirewall()
...
lf.addAttempt(ipAddr)
...
lf.addTimeout(ipAddr, 100000)
  .then(() => {
    response.writeHead(403, {'Content-Type': 'text/plain'})
    response.end('Access denied\n')
  })
  .catch((err= => {
    console.log(err)
  })
...
lf.checkClient(ipAddr)
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
...
```
```Javascript
// Callback example
const LightFirewall = require('light-firewall')
const lf = new LightFirewall()
...
lf.addAttempt(ipAddr, noop)
...
lf.addTimeout(ipAddr, 100000, (err) => {
  if (err) return console.log(err)
  response.writeHead(403, {'Content-Type': 'text/plain'})
  response.end('Access denied\n')
})
...
lf.checkClient(ipAddr, (err, bool) => {
  if (err) return console.log(err)
  if (!bool) {
    console.log('Request accepted')
    response.writeHead(200, {'Content-Type': 'text/plain'})
    response.end('Hello World\n')
  } else {
    console.log('Access denied')
    response.writeHead(403, {'Content-Type': 'text/plain'})
    response.end('Access denied\n')
  }
})


function noop () {}
...
```

## TODO
- [x] Publish to NPM
- [x] Reimplement with promises
- [x] API with promises and callbacks
- [x] More testing
- [ ] Improve docs
- [ ] Add Redis support

## Contributing
If you feel you can help in any way, be it with examples, extra testing, or new features please open a pull request or open an issue.

I would make a special thanks to [@framp](https://github.com/framp) for helping me to improving the code.

The code follows the Standard code style.  
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
______________________________________________________________________________________________________________________
## License
The code is released under the MIT license.

The software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and non infringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.
