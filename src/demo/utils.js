'use strict';

let utilityFunctions = {

  getHashValue: function(name, hash) {

    if(!hash) {
      hash = location.hash.replace('#', '');
    }

    var split = hash.split('&');

    for(var i = 0; i < split.length; i++)
    {
      var pair = split[i].split('=');

      if(pair[0] === name) {
        return pair[1];
      }
    }

    return null;
  }



};

export default utilityFunctions;
