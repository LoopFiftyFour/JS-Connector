var Loop54 = {
    
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
    
    RandomizeUserId: function() {
        
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        Loop54.CreateCookie("Loop54User", text, 365);

        return text;

    },
    
    GetUserId: function () {

        var existing = Loop54.GetCookie("Loop54User");

        if (existing)
            return existing;

        return Loop54.RandomizeUserId();
    },
    
    CreateCookie : function(name, value, days) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        else {
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    },
    
    GetCookie: function(c_name) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                var c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }
    

};

Loop54.Request.prototype.setValue = function(paramName, value) {
    this.parameters[paramName] = value;
};

Loop54.Request.prototype.getValue = function(paramName) {
    return this.parameters[paramName];
};

Loop54.Request.prototype.createEngineUrl = function(url){

	var v25Url = this.options && this.options.use25Url;

	if(!v25Url){
		return url + "/" + this.questName;
	}
	
	return url;
};

Loop54.Request.prototype.getResponse = function(engineUrl, callback) {

    var request = this;

    var questName = this.questName;
    var parameters = this.parameters;
	var options = this.options;
	
	var v25Url = options && options.use25Url;

    if (!this.CreateUserId && !parameters.UserId && !parameters.userId)
        parameters.UserId = Loop54.GetUserId();

	//legacy mode for engines that expect the quest name to be in the JSON data
	if(v25Url)
	{
		var requestObj = {};
		requestObj[questName] = parameters;
	}
	else {
		var requestObj = parameters;
	}
	
	var engineUrl = this.createEngineUrl(engineUrl)

    $.ajax({
        type: "POST",
        dataType: "JSON",
        url: engineUrl,
        data: JSON.stringify(requestObj),
        success: function(data) {
            var responseObj = {};

            if (data.Success) {
                responseObj.success = true;
				
				//legacy mode for engines that return the data wrapped in the quest name
				if(v25Url){
					responseObj.data = data.Data[questName];
				}
				else
				{
					responseObj.data = data.Data;
				}
				
            } else {
                responseObj.success = false;
                responseObj.errorMessage = data.Error_Message;
            }

            request.convertV22Response(responseObj);

            callback(responseObj);
        },
        error: function(data) {

            var responseObj = {};
            responseObj.success = false;
            responseObj.errorMessage = "Connection could not be established.";

            request.convertV22Response(responseObj);
            
            callback(responseObj);
        }
    });

};

Loop54.Request.prototype.convertV22Response = function (responseObj) {

    var data = responseObj.data;
    
    for (var objKey in data) {

        var arr = data[objKey];
        
        if (arr.constructor === Array) {

            for (var i = 0; i < arr.length; i++)
            {
                var item = arr[i];

                //alert(item.String);

                if (item.String)
                    item.Key = item.String;

                if (item.Entity)
                    item.Key = item.Entity;

            }

        }

    }

}