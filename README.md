# IpChecker

IpChecker is a lightweight tool built for NodeJs, used to block the IP addresses that have made too many consecutive requests to the app based on a condition chosen by the developer.  
Can be used as a "firewall" ahead the query-to-db function or in any part of your code where you need to moderate the amount of request from a single ip.

From the version 1.1.0 ipChecker doesn't use anymore a javascript object for store the ip timeout and the attempts, but uses leveldb.
It creates two hidden folders with all the persistent data.

With the version 1.1.0 there have been a lot of changes in the code, now almost all functions have callbacks and what to do after a check is totally customizable by the developer.

*The code is available both in es6 and es5 (compiled by babel) version*

## Usage
Simply download the file from this repository and put in the same directory (or in the /lib folder) of your project.  
Then require the module in your code.
```Javascript
var IpChecker = require("./ipChecker");
```

## API Reference
Here is the list of public API's exposed by the IpChecker module as well as a brief description of their use and how they work.

- <a href="#IpChecker">IpChecker()</a>
- <a href="#setParams">.setParams()</a>
- <a href="#checkIp">.checkIp()</a>
- <a href="#numberOfAttempts">.numberOfAttempts()</a>
- <a href="#maxAttempts">.maxAttempts()</a>
- <a href="#addIpAttempt">.addIpAttempt()</a>
- <a href="#removeIpAttempts">.removeIpAttempts()</a>
- <a href="#isTimeout">.isTimeout()</a>
- <a href="#addIpTimeout">.addIpTimeout()</a>
- <a href="#removeIpTimeout">.removeIpTimeout()</a>

<a name="IpChecker"></a>
### IpChecker(time, attempts)
*@param*  {Number}   **time**  [for how much time ipChecker must freeze an ip address ( default value: 10 mins )]  
*@param*  {Number}   **attempts**  [how many failed attempts before freeze the ip address (default value: 4)]

```Javascript
// declaration without parameters
var ipc = new IpChecker();
// declaration with parameters
var ipc = new IpChecker((1000 * 10), 2);
```

<a name="setParams"></a>
### .setParams(time, attempts)
*@param* {Number} **time**         [time before timeout, default value 10 mins]  
*@param* {Number} **attempts**     [max amount of attempts, default value is 4]  

This function sets the custom values of time and attempts,  
if this values are not given, it uses the defaults values.

<a name="checkIp"></a>
### .checkIp(ip, callback)
*@param*  {String}     **ip**        [ip address of the request]  
*@param*  {Function}   **callback**  [callback]

This function checks if exist a timeout for the ip,  
if not, check if the given ip  have reached the max amount of attempts, if so, it creates a timeout and the callback returns true.  
If the given ip have not reached the max amount of attempts, the callback returns false.

<a name="numberOfAttempts"></a>
### .numberOfAttempts(ip, callback)
*@param*  {String} **ip**        [ip address of the request]  
*@param* {Function} **callback**   [callback]

The callback returns the number of attempts of a given ip,  
if there are not attempts, it returns null.

<a name="maxAttempts"></a>
### .maxAttempts(ip, callback)
*@param*  {String}   **ip**   [ip address of the request]  
*@param* {Function} **callback**   [callback]

The callback returns true if the given ip has reached the max amount of failed attempts,  
otherwise, false.

<a name="addIpAttempt"></a>
### .addIpAttempt(ip)
*@param* {String} **ip** [ip address of the request]

This function add an attempt to the given ip in the ipsAttempts db.  
If the given ip is not present in the ipsAttempts db, it creates a new field.

<a name="removeIpAttempts"></a>
### .removeIpAttempts(ip)
*@param*  {String}   **ip**   [ip address of the request]  

This function checks if the given ip is present in the ipsAttempts db,  
if so, it removes the ip from the db.

<a name="isTimeout"></a>
### .isTimeout(ip, callback)
*@param*  {String}   **ip**   [ip address of the request]  
*@param* {Function} **callback**   [callback]

The callback returns true if the given ip has a timeout,  
otherwise, false.

<a name="addIpTimeout"></a>
### .addIpTimeout(ip, time, callback)
*@param* {String} **ip**            [ip address of the request]  
*@param* {Number} **time**          [time before timeout]  
*@param* {Function} **callback**    [callback]

This function adds a custom timeout to the given ip in the ipsTimeout db.  
Then calls the callback.

<a name="removeIpTimeout"></a>
### .removeIpTimeout(ip)
*@param*  {String}   **ip**   [ip address of the request]  

This function checks if the given ip is present in the ipsTimeout db,  
if so, it removes the ip from the db and clears the timeout.

## Contributing
If you feel you can help in any way, be it with examples, extra testing, or new features please open a pull request or open an issue.

I would make a special thanks to [@framp](https://github.com/framp) for helping me to improving the code.

______________________________________________________________________________________________________________________
## License
The code is released under the GNU GPLv2 license.

The software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and non infringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.
