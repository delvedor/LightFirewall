#IpChecker

IpChecker is a lightweight tool built for NodeJs, used to block the IP addresses that have made too many consecutive requests to the app based on a condition chosen by the developer.  
Can be used as a "firewall" ahead the query-to-db function or in any part of your code where you need to moderate the amount of request from a single ip.

## Usage
Simply download the file from this repository and put in the same directory (or in the /lib folder) of your project.  
Then require the module in your code.
```Javascript
var ipChecker = require("./ipChecker");
```

##API Reference
Here is the list of public API's exposed by the IpChecker module as well as a brief description of their use and how they work.

- <a href="#ipChecker">ipChecker()</a>
- <a href="#setParams">.setParams()</a>
- <a href="#checkIp">.checkIp()</a>
- <a href="#numberOfAttempts">.numberOfAttempts()</a>
- <a href="#maxAttempts">.maxAttempts()</a>
- <a href="#addIpAttempt">.addIpAttempt()</a>
- <a href="#removeIpAttempts">.removeIpAttempts()</a>
- <a href="#isTimeout">.isTimeout()</a>
- <a href="#addIpTimeout">.addIpTimeout()</a>
- <a href="#removeIpTimeout">.removeIpTimeout()</a>

###ipChecker(time, attempts, redirectPage) <a name="ipChecker"></a>
*@param*  {Number}   **time**  [for how much time ipChecker must freeze an ip address ( default value: 10 mins )]  
*@param*  {Number}   **attempts**  [how many failed attempts before freeze the ip address (default value: 4)]   
*@param*  {String} **redirectPage** [where redirect the frozen ip address ( default value: res.end() )]

```Javascript
// declaration without parameters
var ipc = ipChecker();
// declaration with parameters
var ipc = ipChecker((1000 * 10), 2, 'home');
```

###.setParams(time, attempts, redirectPage) <a name="setParams"></a>
*@param* {Number} **time**         [time before timeout, default value 10 mins]  
*@param* {Number} **attempts**     [max amount of attempts, default value is 4]  
*@param* {String} **redirectPage** [page redirect used in checkIp, default value false]

This function sets the custom values of time, attempts and redirectPage,  
if this values are not given, it uses the defaults values. 

###.checkIp(req, res, next) <a name="checkIp"></a>
*@param*  {Object}   **req**  [request params]  
*@param*  {Object}   **res**  [response params]  
*@param*  {Function} **next** [next function]

This function checks if exist a timeout for a given ip, if not, check if the given ip  have reached the max amount of attempts, if so, it creates a timeout of 10 minutes, during the given ip cannot make query to the db.  
If the given ip have not reached the max amount of attempts, the function leaves continue the request.  
If you are calling this function as a Express middleware, you must write it in this way:  
```Javascript
ipc.checkIp.bind(ipc)
```

###.numberOfAttempts(ip) <a name="numberOfAttempts"></a>
*@param*  {String} **ip**        [ip address of the request]  
*@return* {Number} **attempts**  [number of attempts of the ip]

This function return the number of attempts of a given ip,  
if there are not attempts, it returns 0.

###.maxAttempts(ip) <a name="maxAttempts"></a>
*@param*  {String}   **ip**   [ip address of the request]  
*@return* {Boolean}

This function return true if the given ip has reached the max amount of failed attempts,  
otherwise, false.

###.addIpAttempt(ip) <a name="addIpAttempt"></a>
*@param* {String} **ip** [ip address of the request]

This function add an attempt to the given ip in the ipsAttempts object.  
If the given ip is not present in the ipsAttempts object, it creates a new field.

###.removeIpAttempts(ip) <a name="removeIpAttempts"></a>
*@param*  {String}   **ip**   [ip address of the request]  

This function checks if the given ip is present in the ipsAttempts object,  
if so, it removes the ip from the object.

###.isTimeout(ip) <a name="isTimeout"></a>
*@param*  {String}   **ip**   [ip address of the request]  
*@return* {Boolean}

This function return true if the given ip has a timeout,  
otherwise, false.

###.addIpTimeout(ip, time, res, redirectPage) <a name="addIpTimeout"></a>
*@param* {String} **ip**            [ip address of the request]  
*@param* {Number} **time**          [time before timeout]  
*@param* {Object} **res**           [response params]  
*@param* {String} **redirectPage**  [page redirect] 

This function add a custom timeout to the given ip in the ipsTimeout object.  
Then redirects the ip to the custom redirectPage or closes the connection.

###.removeIpTimeout(ip) <a name="removeIpTimeout"></a>
*@param*  {String}   **ip**   [ip address of the request]  

This function checks if the given ip is present in the ipsTimeout object,  
if so, it removes the ip from the object and clears the timeout.

##Contributing
If you feel you can help in any way, be it with examples, extra testing, or new features please open a pull request or open an issue.

I would make a special thanks to [@framp](https://github.com/framp) for helping me to improving the code.

______________________________________________________________________________________________________________________
##License
The code is released under the GNU GPLv2 license.

The software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.
