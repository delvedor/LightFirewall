# IpChecker
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)  

IpChecker is a lightweight firewall built for NodeJs.  
It provides some useful tools for the developer to track the number of attempts a client has performed and assigns a timeout after a certain number of attempts decided by the developer, where the client will be "frozen."

It can be used to limit excessive requests to a DB, or to block a client that is making too many requests to a service.  
[Example](https://github.com/delvedor/ipChecker/blob/master/example.js)

From the version 1.1.0 ipChecker doesn't use anymore a javascript object for store the ip timeout and the attempts, but uses [LevelDB](https://github.com/Level/levelup).
It creates two hidden folders with all the persistent data.

**Needs Node.js >= 4.0.0**

## Usage
Simply download the file from this repository and put in the same directory (or in the /lib folder) of your project.  
Then require the module in your code.
```Javascript
const IpChecker = require("./ipChecker")
```

## API Reference
Here is the list of public API's exposed by the IpChecker module as well as a brief description of their use and how they work.

- <a href="#IpChecker">IpChecker()</a>
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

<a name="IpChecker"></a>
### IpChecker(time, attempts, showErrors)
*@param*  {Number}   **time**  [for how much time ipChecker must freeze an ip address ( default value: 10 mins )]  
*@param*  {Number}   **attempts**  [how many failed attempts before freeze the ip address (default value: 4)]
*@param*  {Boolean}  **showErrors** [toggle show errors (default value: false)]
```Javascript
// declaration without parameters
const ipc = new IpChecker()
// declaration with parameters
const ipc = new IpChecker((1000 * 10), 2, true)
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
This function removes a given client from the ipChecker's DB.

## TODO
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
