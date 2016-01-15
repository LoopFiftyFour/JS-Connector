import axios from 'axios';

import cookies from './cookies.js';

import comp from './combabillity.js';

let Loop54 = {

    config: {
      libVersion: '1.0.0',
      use25Url: false,
      url: 'No URL set for Loop54 server.'
    },

    setConfig: function (conf) {
      this.config = {...this.config, ...conf};
    },

    getRandomUserId: () => {
        
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        cookies.set("Loop54User", text, 365);

        return text;

    },

    getUserId: function () {

      var existing = cookies.get("Loop54User");

      if (existing) {
          return existing;
      }

      return this.getRandomUserId();
    },
    
    getRequestObj: function (params) {

      let requestObj = {};

      if (!this.CreateUserId && !params.UserId && !params.userId) {
          params.UserId = this.getUserId();
      }

      //legacy mode for engines that expect the quest name to be in the JSON data
      if (this.config.use25Url) {
        requestObj[questName] = params;
      } else {
        requestObj = params;
      }

      return JSON.stringify(requestObj);

    },

    getEngineUrl: function (req) {

      let url = this.config.url;
      url = url + (url[url.length - 1] === '/' ? '' : '/') ;

      if(!this.config.use25Url) {
        return url + req.QuestName;
      }

      return url;
 
    },
     
    getResponse: function (req) {

      let v25Url = this.config.use25Url;

      const requestObj = this.getRequestObj(req);
      const engineUrl = this.getEngineUrl(req);

      let promise = axios.post(engineUrl, requestObj)
        .then(function (response) {

          var data = response.data;
          var responseObj = {
            success: !!data.Success
          };

          if (!responseObj.success) {
            responseObj.errorMessage = data.Error_Message;
            return responseObj;
          }
            
          //legacy mode for engines that return the data wrapped in the quest name
          if(v25Url){
            responseObj.data = data.Data[questName];
          }
          else
          {
            responseObj.data = data.Data;
          }

          comp.convertV22Response(responseObj);

          return responseObj;
        })
        .catch(function (response) {
          
          var responseObj = {};
          responseObj.success = false;
          responseObj.errorMessage = "Connection could not be established.";

          comp.convertV22Response(responseObj);

          return responseObj;

        });

        return promise;
    },


};


module.exports = Loop54;

