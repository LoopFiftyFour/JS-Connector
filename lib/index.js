'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _cookies = require('./cookies.js');

var _cookies2 = _interopRequireDefault(_cookies);

var _combabillity = require('./combabillity.js');

var _combabillity2 = _interopRequireDefault(_combabillity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Loop54 = {

  config: {
    libVersion: '1.0.0',
    use25Url: false,
    url: 'No URL set for Loop54 server.'
  },

  setConfig: function setConfig(conf) {
    this.config = _extends({}, this.config, conf);
  },

  getRandomUserId: function getRandomUserId() {

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }_cookies2.default.set("Loop54User", text, 365);

    return text;
  },

  getUserId: function getUserId() {

    var existing = _cookies2.default.get("Loop54User");

    if (existing) {
      return existing;
    }

    return this.getRandomUserId();
  },

  getRequestObj: function getRequestObj(params) {

    var requestObj = {};

    if (!this.CreateUserId && !params.UserId && !params.userId) {
      params.UserId = this.getUserId();
    }

    //legacy mode for engines that expect the quest name to be in the JSON data
    if (this.config.use25Url) {
      requestObj[params.QuestName] = _extends({}, params);
      delete requestObj[params.QuestName].QuestName;
    } else {
      requestObj = _extends({}, params);
      delete requestObj.QuestName;
    }

    return JSON.stringify(requestObj);
  },

  getEngineUrl: function getEngineUrl(req) {

    var url = this.config.url;
    url = url + (url[url.length - 1] === '/' ? '' : '/');

    if (!this.config.use25Url) {
      return url + req.QuestName;
    }

    return url;
  },

  getResponse: function getResponse(req) {

    var v25Url = this.config.use25Url;

    var requestObj = this.getRequestObj(req);
    var engineUrl = this.getEngineUrl(req);

    var promise = _axios2.default.post(engineUrl, requestObj).then(function (response) {

      var data = response.data;
      var responseObj = {
        success: !!data.Success
      };

      if (!responseObj.success) {
        responseObj.errorMessage = data.Error_Message;
        return responseObj;
      }

      //legacy mode for engines that return the data wrapped in the quest name
      if (v25Url) {
        responseObj.data = data.Data[questName];
      } else {
        responseObj.data = data.Data;
      }

      _combabillity2.default.convertV22Response(responseObj);

      return responseObj;
    }).catch(function (response) {

      var responseObj = {};
      responseObj.success = false;
      responseObj.errorMessage = "Connection could not be established.";

      _combabillity2.default.convertV22Response(responseObj);

      return responseObj;
    });

    return promise;
  }

};

module.exports = Loop54;