/*
 * Project: IpChecker
 * Version: 1.1.0
 * Author: delvedor
 * Twitter: @delvedor
 * License: GNU GPLv2
 * GitHub: https://github.com/delvedor/ipChecker
 */

'use strict';

let test = require('tape');
let execSync = require('child_process').execSync;
let IpChecker = require('./ipChecker.js');

execSync('rm -rf .ipchecker-ipstimeout .ipchecker-ipsattempts');

let ipc = new IpChecker();
let ip = '::1';

test('Testing function - setParams()', (t) => {
  t.plan(2);
  let time = Math.floor(Math.random() * 1000) + 1;
  let attempts = Math.floor(Math.random() * 6) + 1;
  ipc.setParams(time, attempts);
  t.equal(ipc.time, time, 'Time was correctly changed.');
  t.equal(ipc.attempts, attempts, 'Attempts was correctly changed');
});

test('Testing function - addIpAttempt()', (t) => {
  t.plan(1);
  for (let i = 0; i < 15; i = i + 5)
    setTimeout(() => {
      ipc.addIpAttempt(ip);
    }, i);

  setTimeout(() => {
    ipc.ipsAttempts.get(ip, (err, attempts) => {
      t.equal(attempts, '3', 'addIpAttempt()');
    });
  }, 20);
});

test('Testing function - numberOfAttempts()', (t) => {
  t.plan(1);
  ipc.numberOfAttempts(ip, (attempts) => {
    if (attempts)
      t.equal(attempts, 3, 'numberOfAttempts()');
    else
      t.equal(attempts, null, 'numberOfAttempts()');
  });
});

test('Testing functions - maxAttempts()', (t) => {
  t.plan(1);
  ipc.numberOfAttempts(ip, (attempts) => {
    ipc.maxAttempts(ip, (bool) => {
      if (attempts >= ipc.attempts)
        t.equal(bool, true, 'maxAttempts()');
      else
        t.equal(bool, false, 'maxAttempts()');
    });
  });
});

test('Testing function - removeIpAttempts()', (t) => {
  t.plan(1);
  ipc.removeIpAttempts(ip);

  setTimeout(() => {
    ipc.ipsAttempts.get(ip, (err, attempts) => {
      t.equal(attempts, undefined, 'removeIpAttempts()');
    });
  }, 20);
});

test('Testing function - addIpTimeout()', (t) => {
  t.plan(2);
  ipc.addIpTimeout(ip, (1000 * 60 * 10), () => {
    ipc.ipsTimeout.get(ip, (err, timeout) => {
      t.equal(typeof timeout, 'string', 'addIpTimeout()');
      if (!Date.parse(timeout))
        t.notok(timeout, 'Not a correct date format.');
      else
        t.ok(timeout, 'Correct date format.');
    });
  });
});

test('Testing function - isTimeout()', (t) => {
  t.plan(1);
  ipc.ipsTimeout.get(ip, (err, timeout) => {
    if (!timeout)
      timeout = false;
    else if (new Date() < Date.parse(timeout))
      timeout = true;
    else
      timeout = false;

    ipc.isTimeout(ip, (isTimeout) => {
      t.equal(isTimeout, timeout, 'isTimeout()');
    });
  });
});

test('Testing function - removeIpTimeout()', (t) => {
  t.plan(1);
  ipc.removeIpTimeout(ip);

  setTimeout(() => {
    ipc.ipsTimeout.get(ip, (err, timeout) => {
      t.equal(timeout, undefined, 'removeIpTimeout()');
    });
  }, 20);
});


test('Testing function - checkIp()/1', (t) => {
  t.plan(1);
  ipc.addIpTimeout(ip, (1000 * 60 * 10), () => {
    ipc.checkIp(ip, (timeout) => {
      t.equal(timeout, true, 'checkIp()/1');
    });
  });
});

test('Testing function - checkIp()/2', (t) => {
  t.plan(1);
  ipc.addIpAttempt(ip);

  setTimeout(() => {
    ipc.ipsAttempts.get(ip, (err, attempts) => {
      ipc.checkIp(ip, (timeout) => {
        if (attempts >= ipc.attempts)
          t.equal(timeout, true, 'checkIp()/2');
        else {
          t.equal(timeout, false, 'checkIp()/2');
        }
      });
    });
  }, 50);
});
