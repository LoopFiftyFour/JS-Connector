import axios from 'axios';

import cookies from './cookies.js';

import comp from './combabillity.js';

let Loop54 = {

    config: {
      use25Url: false,
      url: 'No URL set for Loop54 server.'
    },

    setConfig: (conf) => {
      this.config = {conf, ...this.config};
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
    

    getResponse: (req, params, questName) => {

      var v25Url = this.use25Url;

      if (!this.CreateUserId && !params.UserId && !params.userId) {
          params.UserId = Loop54.GetUserId();
      }

      var requestObj = {};
      
      //legacy mode for engines that expect the quest name to be in the JSON data
      if (this.v25Url) {
        requestObj[questName] = params;
      } else {
        requestObj = params;
      }

      var engineUrl = this.config.url;

      if(!this.v25Url) {
        engineUrl = this.config.url + "/" + req.questName;
      }

      let promise = axios.post(engineUrl, JSON.stringify(requestObj) )
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
          debugger;
          
          var responseObj = {};
          responseObj.success = false;
          responseObj.errorMessage = "Connection could not be established.";

          comp.convertV22Response(responseObj);
          
          return responseObj;

        });

        return promise;
    },


// ----------------

    Entity: function(entityType, externalId) {
      this.EntityType = entityType;
      this.ExternalId = externalId;
    },
    
    RequestOptions: function(use25Url){
      this.use25Url = use25Url;
    },

    Request: function(questName,requestOptions) {
      this.parameters = {};
      this.questName = questName;
      this.options = requestOptions;
    },
    
    Event: function(type,entity,quantity,revenue,orderId) {
      this.Type = type;
      this.Entity = entity;
      this.Quantity = quantity;
      this.Revenue = revenue;
      this.OrderId = orderId;
    },
    

};



export default Loop54;

