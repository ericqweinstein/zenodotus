'use strict';

var validators = {
  title: function(v) {
    return v.match(/\S+/) && v !== ''; 
  }
, isbn: function(v) {
    return !isNaN(v) && Math.ceil(Math.log(v + 1) / Math.LN10) === 13; 
  }
, quantity: function(v) {
    return v > 0;
  }
, available: function(v) {
    return v >= 0;
  }
, name: function(v) {
    return v.match(/\S+/) && v !== ''; 
  }
, email: function(v) {
    return v.match(/(?:\S+)@(?:\S+)/); 
  }
};

module.exports = validators;

