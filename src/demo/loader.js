/*globals $ */


let loader = {

  loadConfig: function() {
    // loads a config.json or else defaultconfig.json file from server
    // returns promise, use: loader.loadConfig().success(function(data) { // do something with data here }));

    return $.ajax({
      dataType: 'json',
      url: 'config.json',
      error: function() {
        $.ajax(
        {
          dataType: 'json',
          url: 'defaultconfig.json',
          error: function() {
            console.log('Could not load config.json or defaultconfig.json');
          }
        });
      }
    });
  },

  loadDemoConfig: function(configName, callback){

    $.ajax({
      dataType: 'json',
      url: config.AdminApiUrl + '/api/Demos/actions/GetByName?name=' + configName,
      success: function (data) {
      
        config=data;
        
        Demo.InitFacetting();
        
        if (demoConfig.ContinousScrolling) {
          $(window).bind('scroll', function() {

            Demo.DisplayMore();
          });
        }
        else
          $(window).unbind('scroll');
        
        callback();
      },
      error: function(){
        console.log('Could not load demo config ' + configName);
      }
    });
  
  },

};

export default loader;

