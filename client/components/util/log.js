'use strict';

/* jshint unused:false */

function log(msg) {
  console.log(msg);
}

function logStringify(data) {
  log(JSON.stringify(data, null, 2));
}

function logTable(data) {
  console.table(data);
}

function logDir(obj) {
  console.dir(obj);
}
