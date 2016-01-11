
// requires jQuery to be in global scope
/*globals $ */

let lib = global.Loop54;

// let utils = require('utils');

let render = function (config, guiConfig) {


  function initFacetting() {

    let $filters = $(guiConfig.filters);

    $filters.empty();

    for (var i = 0; i < config.filters.length; i++) {
      $filters
        .append($('<h2/>').html(config.filters[i].Name))
        .append($('<div/>').attr('id', 'filter_' + config.filters[i].Name).addClass('filterdiv'));
    }

  }


  // $(window).hashchange(function (e,data) {

  //     Demo.HashChanged(data.before.replace('#', ''),data.after.replace('#', ''));

  // });



  // $(document).click(function(event) {

  //     if(!$(event.target).is('div#autocomplete') && !$(event.target).is('div#autocomplete *'))
  //         Demo.ClearSuggestions();

  // });
  
  
  // Demo.LoadConfig(function(){
    
  //   Demo.HashChanged(null,location.hash.replace('#', ''));

  // });


  function replaceImageUrl(entity) {

    var ret = config.productImageUrl;

    for (var i = 0; i < config.productImageUrlAttributes.length; i++) {

      var attr = config.productImageUrlAttributes[i];

      var attrValue = '';

      if (attr == 'ExternalId') {
        attrValue = entity.ExternalId;
      } else if (entity.Attributes[config.productImageUrlAttributes[i]]) {
        attrValue = entity.Attributes[config.productImageUrlAttributes[i]][0];
      }

      // Replace doesn't like "$&" in the image url...
      ret = ret.split('$' + (i + 1)).join(attrValue);
    }

    return ret;
  }

  function getEntityTitle(entity) {

    if (entity.Attributes[config.productTitleAttribute]) {
      return entity.Attributes[config.productTitleAttribute][0];
    }

    return '';
  }

  function getEntityDescription(entity) {

    if (entity.Attributes[config.ProductDescriptionAttribute]) {
      return entity.Attributes[config.ProductDescriptionAttribute][0];
    }

    return '';
  }


  return {

    showMakesNoSense: function (directResults, spellingSuggestions, query, searchCallback) {

      $(guiConfig.makesSense).show();

      $(guiConfig.makesSenseHeader).html("We did not understand the query \"" + query + "\". ");

      if (directResults && directResults.length > 0) {
        $(guiConfig.makesSenseHeader).append($("<span>The results below are approximate.</span>"));
      }

      if (spellingSuggestions && spellingSuggestions.length > 0) {

        $(guiConfig.spellingSuggestions).html("Did you mean to search for: ");

        for (var i = 0; i < spellingSuggestions.length; i++) {
          $(guiConfig.spellingSuggestions).append(
            $('<a/>')
              .html(spellingSuggestions[i].Key)
              .data('query', spellingSuggestions[i].Key)
              .click(function () {
                searchCallback({
                  query: $(this).data('query'),
                  clearFilters: true
                });
              })
          );
        }
      }
    },

    showReSearch: function (reSearchString, originalQuery, searchCallback) {
debugger;
      $(guiConfig.reSearch)
        .show()
        .html('We assumed you meant \'' + reSearchString + '\'. Can you blame us?<br /><br />Search instead for ')
        .append(
          $('<a />').html(originalQuery).click(function () {
            searchCallback({
              query: $(this).data('query'),
              clearFilters: true,
              instant: false,
              preventReSearch: true
            });
          })
      );
    },

    addRelated: function (related, searchCallback) {

      function onClick () {
        searchCallback({
          query: $(this).data('query'),
          clearFilters: true,
          instant: false,
          preventReSearch: false
        });
      }

      for (var i = 0; i < related.length; i++) {

        $(guiConfig.related)
          .append(
            $('<a/>')
              .html(related[i].Key)
              .data('query', related[i].Key)
              .click(onClick)
          );
      }

      $(guiConfig.related).show();

    },

    directResults: function (directResults, totalItems, isContinuation, createEventCallback) {

      if(!isContinuation) {
        $(guiConfig.directResults).append($('<h2>We found ' + totalItems + ' results</h2>'));
      }

      for (var i = 0; i < directResults.length; i++) {
        this.renderEntity(guiConfig.directResults, directResults[i].Key, directResults[i].Value, createEventCallback);
      }

    },

    recommendedResults: function (recommendedResults, isContinuation, createEventCallback) {

      if (!isContinuation) {
        $(guiConfig.recommendedResults).append($('<h2>You might also like</h2>'));
      }

      for (var i = 0; i < recommendedResults.length; i++) {
        this.renderEntity(guiConfig.recommendedResults, recommendedResults[i].Key, recommendedResults[i].Value, createEventCallback);
      }

    },

    noRecommendedResults: function () {
      $(guiConfig.recommendedResults).hide();
      $(guiConfig.directResults).addClass('fillout');

    },


    clearSearch: function (keepResults) {

      if (!keepResults) {
        $(guiConfig.directResults).empty().removeClass('fillout');

        $(guiConfig.recommendedResults).empty().show();
      }

      $(guiConfig.makesSense).hide();
      $(guiConfig.spellingSuggestions).empty();
      $(guiConfig.research).hide();
      $(guiConfig.related).empty().hide();

    },

    hidePopup: function () {
      $('div#popupbg').hide();
      $('div.entitypopup').remove();
    },

    hideAutocomplete: function () {
      $('div#autocomplete').hide();
    },

    renderEntity: function(element, entity, value, createEventCallback) {

      var imgUrl = replaceImageUrl(entity),
          entityTitle = getEntityTitle(entity);
      var self = this;

      var div = $('<div/>')
        .addClass('entity')
        .data('entity', entity)
        .data('value', value)
        .click(function() {
          self.showEntity($(this).data('entity'), $(this).data('value'), createEventCallback);
        });

      if (config.showValues) {
        div.attr('title', value);
      }

      var a = $('<a/>').appendTo(div);
      var imgDiv = $('<div/>').appendTo(a);
      $('<img/>')
        .attr('src', imgUrl)
        .appendTo(imgDiv)
        .on('load', function () {

          if ($(this).width() > $(this).height()) {
            $(this).css('width', '100%');
          } else {
            $(this).css('height', '100%');
          }
        })
        .on('error', function() {
          $(this).remove();
        });

      $('<span/>').html(entityTitle).appendTo(a);

      div.appendTo($(element));
    },

    showEntity: function(entity, value, createEventCallback) {

        // Demo.SetHash("config=" + demoConfig.Name + "&page=entity&id=" + entity.ExternalId);

      createEventCallback(entity, 'click');

      $('div#popupbg').show();
      $('div.entitypopup').remove();

      var div = $('<div/>').addClass('entitypopup').appendTo($('body')).css('top', $(window).scrollTop() + 100);

      function closePopup() {
        $('div#popupbg').hide();
        $('div.entitypopup').remove();
      }

      $('<a/>').addClass('close').html('X').click(closePopup).appendTo(div);
      $('div#popupbg').click(closePopup);
      $(window).bind('keydown', function (event) {
        if (event.which === 27 && $('div#popupbg').is(':visible')) {
          closePopup();
        }
      });

      //main stuff

      $('<img/>')
        .attr('src', replaceImageUrl(entity))
        .appendTo(div)
        .on('error', function () {
          $(this).remove();
        });

      $('<h2/>').html(getEntityTitle(entity)).appendTo(div);

      $('<div/>').addClass('description').html(getEntityDescription(entity)).appendTo(div);

      $('<a/>').addClass('button').html('Purchase').click(function () {
        createEventCallback(entity, 'purchase');
        $(this).off('click').addClass('inactive');
      }).appendTo(div);


      //extra info
      if (!config.devMode)
      {
        $('<a/>').html('Show all attributes').addClass('showhide').appendTo(div).click(function() {
          $('div.entitypopup div.moreinfo').show();
          $(this).remove();
        });
      }

      var hiddenDiv = $('<div/>').addClass('moreinfo').appendTo(div);

      $('<span/>').html('<b>EntityType</b>: ' + entity.EntityType).appendTo(hiddenDiv);
      $('<span/>').html('<b>ExternalId</b>: ' + entity.ExternalId).appendTo(hiddenDiv);
      $('<span/>').html('<b>Value</b>: ' + value).appendTo(hiddenDiv);

      for (var key in entity.Attributes) {
        $('<span/>').html('<b>' + key + '</b>: ' + entity.Attributes[key]).appendTo(hiddenDiv);
      }

      if (config.devMode) {
        hiddenDiv.show();
      }
    },

    initFacetting

  };

};


export default render;
