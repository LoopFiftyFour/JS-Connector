import axios from 'axios';
import cookies from './cookies.js';

let Loop54 = {
  config: {
    libVersion: '0.1.6',
    apiVersion: 'V26',
    url: 'No URL set for Loop54 server.'
  },

  setConfig: function(newConfig) {
    this.config = { ...this.config, ...newConfig };
  },

  getRandomUserId: function() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    cookies.set('Loop54User', text, 365);
    return text;
  },

  getUserId: function() {
    var existing = cookies.get('Loop54User');
    if (existing) {
      return existing;
    }
    return this.getRandomUserId();
  },

  getRequestObj: function(params) {
    let requestObj = {};
    if (!params.UserId && !params.userId) {
      params.UserId = this.getUserId();
    }

    requestObj = { ...params };
    delete requestObj.QuestName;
    return JSON.stringify(requestObj);
  },

  getEngineUrl: function(req) {
    let url = this.config.url;
    url = url + (url[url.length - 1] === '/' ? '' : '/');
    return url + req.QuestName;
  },

  getResponse: function(req) {
    const requestObj = this.getRequestObj(req);
    const engineUrl = this.getEngineUrl(req);
    const config = { headers: {
      'Api-Version': this.config.apiVersion,
      'Lib-Version': 'js:' + this.config.libVersion,
    }};

    let promise = axios.post( engineUrl, requestObj, config )
    .then(function(response) {
      var data = response.data;
      var responseObj = {
        success: !!data.Success,
      };

      if (responseObj.success) {
        responseObj.data = data.Data;
      } else {
        responseObj.errorMessage = data.Error_Message;
      }
      return responseObj;
    }).catch(function(response) {
      var responseObj = {
        success: false,
        errorMessage: 'Connection could not be established.',
      };
      return responseObj;
    });
    return promise;
  },
};

module.exports = Loop54;
