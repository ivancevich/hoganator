'use strict';
var path = require('path');
var Hogan = require('./compiler.js');
Hogan.Template = require('hogan.js/lib/template').Template;
Hogan.template = Hogan.Template;

module.exports = Hogan;
