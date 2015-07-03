'use strict';
var template = require('./output/template');
var path = require('path');
var main = require('./output/main');
var expect = require('chai').expect;

describe('hoganator', function () {

  it('should render template', function () {
    var result = template({
      name: 'JC'
    });
    expect(result).to.equal('<h1>Hello JC</h1>');
  });

  it('should render template with partial', function () {
    var result = main({
      name: 'JC'
    });
    expect(result).to.equal('<section><h1>Hello JC</h1></section>');
  });

});
