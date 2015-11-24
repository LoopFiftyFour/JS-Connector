
// requires jQuery to be in global scope
/*globals $ */

let lib = global.Loop54;

let utils = require('utils');

let render = function (config) {



  // handler functions



  // init eventhandlers
  $(document).ready(function () {

    $(config.inputSearch)
      .addClass('gray')
      .bind('focus', function () {
        if ($(this).val() === 'What are you looking for?') {
          $(this).val('').removeClass('gray');
        }
      })
      .bind('blur', function () {
        if ($(this).val() === '') {
          $(this).val('What are you looking for?').addClass('gray');
        }
      });

    $(config.inputSearch).bind('keyup', this.keyUp);

    $('a#user').click(function() {
      lib.getRandomUserId();
    });

    $('a#searchbutton').click(function() {

        Demo.ClearFilters();
        Demo.Search($('input#search').val(),false,false,0);

    });

    
    

    $(window).hashchange(function (e,data) {

        Demo.HashChanged(data.before.replace('#', ''),data.after.replace('#', ''));

    });



    $(document).click(function(event) {

        if(!$(event.target).is('div#autocomplete') && !$(event.target).is('div#autocomplete *'))
            Demo.ClearSuggestions();

    });
  
  
  Demo.LoadConfig(function(){
    
    Demo.HashChanged(null,location.hash.replace('#', ''));
    
    
  
  });

   
});






};

export default render;