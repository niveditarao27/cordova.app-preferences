'use strict';

module.exports = function (context) {

  var path = require('path');

  var pathParse = require('./lib/path-parse');

  path.parse = path.parse || pathParse;

  return true;

};