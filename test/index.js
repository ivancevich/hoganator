'use strict';
var template = require('./output/template');
var expect = require('chai').expect;

describe('hoganator', function () {

  it('should render template', function () {
    var result = template({ name: 'JC' });
    expect(result).to.equal('<h1>Hello JC</h1>');
  });

});
