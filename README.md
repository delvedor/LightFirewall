# Light Firewall
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)  

*Formerly known as ipChecker.*  
Light Firewall is a lightweight firewall built for NodeJs.  
It provides some useful tools for the developer to track the number of attempts a client has performed and assigns a timeout after a certain number of attempts decided by the developer, where the client will be "frozen."

It can be used to limit excessive requests to a DB, or to block a client that is making too many requests to a service.  
Here you can find an [example](https://github.com/delvedor/LightFirewall/blob/master/example.js).

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
const LightFirewall = require('light-firewall')
```

## API Reference
Here is the list of public API's exposed by the Light Firewall module as well as a brief description of their use and how they work.  
All the functions except for LightFirewall, getClient and checkClient, are chainable.

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
### LightFirewall(time, attempts, showErrors)
*@param*  {Number}   **time**  [for how much time Light Firewall must freeze an ip address ( default value: 10 mins )]  
*@param*  {Number}   **attempts**  [how many failed attempts before freeze the ip address (default value: 4)]  
*@param*  {Boolean}  **showErrors** [toggle show errors (default value: false)]
```Javascript
// declaration without parameters
const ipc = new LightFirewall()
// declaration with parameters
const ipc = new LightFirewall((1000 * 10), 2, true)
```

<a name="setTime"></a>
### setTime(time)
*@param* {Number} **time**  [timeout time]  
Sets the timeout time.

<a name="setAttempts"></a>
### setAttempts(attempts)
*@param* {Number} **attempts**  [max number of attempts]  
Sets the maximum number of attempts.

<a name="setShowErrors"></a>
### setShowErrors(showErrors)
*@param* {Boolean} **showErrors**  [show errors]  
Toggles errors log.

<a name="addAttempt"></a>
### addAttempt(ip)
*@param* {String} **ip**  [ip address of the request]  
This function adds an attempt to a given client.

<a name="removeAttempts"></a>
### removeAttempts(ip)
*@param* {String} **ip**  [ip address of the request]  
This function removes all the attempts of a given client.

<a name="addTimeout"></a>
### addTimeout(ip)
*@param* {String} **ip**  [ip address of the request]  
This function adds a timeout to a given client.

<a name="removeTimeout"></a>
### removeTimeout(ip)
*@param* {String} **ip**  [ip address of the request]  
This function removes the timeout of a given client.

<a name="getClient"></a>
### getClient(ip)
*@param* {String} **ip**  [ip address of the request]  
*@param* {Function}   **callback**    [callback]  
This function returns the client and all his data, it returns null if the client is not in the DB.

<a name="checkClient"></a>
### checkClient(ip)
*@param* {String} **ip**  [ip address of the request]  
*@param* {Function}   **callback**    [callback]  
This function checks (in order):  
1. If the given client exist, if not it returns false  
2. if the given client has reached the maximum number of attempts, if so it adds a timeout, removes the attempts and returns true  
3. if the given client has an active timeout, if so it returns true  
4. If none of above, it returns false.

<a name="removeClient"></a>
### removeClient(ip)
*@param* {String} **ip**  [ip address of the request]  
This function removes a given client from the Light Firewall's DB.

## TODO
- [ ] Improve docs
- [ ] Publish to NPM
- [ ] Add Redis support

## Contributing
If you feel you can help in any way, be it with examples, extra testing, or new features please open a pull request or open an issue.

I would make a special thanks to [@framp](https://github.com/framp) for helping me to improving the code.

The code follows the Standard code style.  
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
______________________________________________________________________________________________________________________
## License
The code is released under the GNU GPLv2 license.

The software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and non infringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.
