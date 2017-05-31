'use strict';

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

var _promisePolyfill = require('promise-polyfill');

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// vanilla JS compabillity
global.Loop54 = _index2.default;

global.Promise = _promisePolyfill2.default;