

let compabillityFunctions = {

  convertV22Response: (responseObj) => {

    var data = responseObj.data;

    for (var objKey in data) {

      var arr = data[objKey];

      if (arr.constructor === Array) {

        for (var i = 0; i < arr.length; i++) {
          var item = arr[i];

          if (item.String){
            item.Key = item.String;
          }

          if (item.Entity){
            item.Key = item.Entity;
          }
        }
      }
    }
  }
};


export default compabillityFunctions;
