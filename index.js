'use strict';
var Hogan = require('hogan.js/lib/compiler.js');
Hogan.Template = require('hogan.js/lib/template').Template;
Hogan.template = Hogan.Template;

Hogan.Template.prototype.ep = function (symbol, partials) {
  var partial = this.partials[symbol];

  // check to see that if we've instantiated this partial before
  var template = partials[partial.name];
  if (partial.instance && partial.base == template) {
    return partial.instance;
  }

  if (typeof template == 'string') {
    if (!this.c) {
      throw new Error("No compiler available.");
    }
    template = this.c.compile(template, this.options);
  }

  if (!template) {
    return null;
  }

  // CommonJS support
  if (template.path) {
    template = require(template.path).template;
  }

  // We use this to check whether the partials dictionary has changed
  this.partials[symbol].base = template;

  if (partial.subs) {
    // Make sure we consider parent template now
    if (!partials.stackText) partials.stackText = {};
    for (key in partial.subs) {
      if (!partials.stackText[key]) {
        partials.stackText[key] = (this.activeSub !== undefined && partials.stackText[this.activeSub]) ? partials.stackText[this.activeSub] : this.text;
      }
    }
    template = createSpecializedPartial(template, partial.subs, partial.partials,
      this.stackSubs, this.stackPartials, partials.stackText);
  }
  this.partials[symbol].instance = template;

  return template;
};

module.exports = Hogan;

function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {
  function PartialTemplate() {};
  PartialTemplate.prototype = instance;

  function Substitutions() {};
  Substitutions.prototype = instance.subs;
  var key;
  var partial = new PartialTemplate();
  partial.subs = new Substitutions();
  partial.subsText = {}; //hehe. substext.
  partial.buf = '';

  stackSubs = stackSubs || {};
  partial.stackSubs = stackSubs;
  partial.subsText = stackText;
  for (key in subs) {
    if (!stackSubs[key]) stackSubs[key] = subs[key];
  }
  for (key in stackSubs) {
    partial.subs[key] = stackSubs[key];
  }

  stackPartials = stackPartials || {};
  partial.stackPartials = stackPartials;
  for (key in partials) {
    if (!stackPartials[key]) stackPartials[key] = partials[key];
  }
  for (key in stackPartials) {
    partial.partials[key] = stackPartials[key];
  }

  return partial;
}
