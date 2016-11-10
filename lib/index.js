'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _cookies = require('./cookies.js');

var _cookies2 = _interopRequireDefault(_cookies);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Loop54 = {
  config: {
    libVersion: '0.1.6',
    apiVersion: 'V26',
    url: 'No URL set for Loop54 server.'
  },

  setConfig: function setConfig(newConfig) {
    this.config = _extends({}, this.config, newConfig);
  },

  getRandomUserId: function getRandomUserId() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    _cookies2.default.set('Loop54User', text, 365);
    return text;
  },

  getUserId: function getUserId() {
    var existing = _cookies2.default.get('Loop54User');
    if (existing) {
      return existing;
    }
    return this.getRandomUserId();
  },

  getRequestObj: function getRequestObj(params) {
    var requestObj = {};
    if (!params.UserId && !params.userId) {
      params.UserId = this.getUserId();
    }

    requestObj = _extends({}, params);
    delete requestObj.QuestName;
    return JSON.stringify(requestObj);
  },

  getEngineUrl: function getEngineUrl(req) {
    var url = this.config.url;
    url = url + (url[url.length - 1] === '/' ? '' : '/');
    return url + req.QuestName;
  },

  getResponse: function getResponse(req) {
    var requestObj = this.getRequestObj(req);
    var engineUrl = this.getEngineUrl(req);
    var config = { headers: {
        'Api-Version': this.config.apiVersion,
        'Lib-Version': 'js:' + this.config.libVersion
      } };

    var promise = _axios2.default.post(engineUrl, requestObj, config).then(function (response) {
      var data = response.data;
      var responseObj = {
        success: !!data.Success
      };

      if (responseObj.success) {
        responseObj.data = data.Data;
      } else {
        responseObj.errorMessage = data.Error_Message;
      }
      return responseObj;
    }).catch(function (response) {
      var responseObj = {
        success: false,
        errorMessage: 'Connection could not be established.'
      };
      return responseObj;
    });
    return promise;
  }
};

module.exports = Loop54;