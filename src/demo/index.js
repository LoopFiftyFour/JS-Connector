/*globals $ */

'use strict';

// ES5 style javascript: include lib on page and assume script is imported and in global scope: global.Loop54
var lib = global.Loop54;

// ES6 or using requre.js: import/require lib and use
//import lib from '../lib/index.js';


import renderFunc from './render.js';


var guiConfig = {
  inputSearch: 'input#search',
  buttonSearch: 'a#searchbutton',
  inputSearchText: 'You search, now',
  filters: 'div#filters',
  //autocompleteContainer: 'div#autocomplete',
  //searchButtonContainer: 'div.form-search button',
  //directResultsContainer: 'div#products-wrapper',
  recommendedResults: 'div#recommendedresults',
  //directResultsContainerId: 'products-wrapper',
  directResults: 'div#directresults',
  breadCrumbsContainer: '#breadcrumbs-wrapper',
  queryInBreadCrumb: '#breadcrumbs-wrapper div.breadcrumbs div.block.search.current strong span',
  makesSense: 'div#nosense',
  makesSenseHeader: 'div#nosenseheader',
  spellingSuggestions: 'div#spellingsuggestions',
  reSearch: 'div#research',
  related: 'div#related',
};

var config = {
  id: '18eb1533-a1f7-4ec8-9211-a561dcf43597',
  name: 'Netrauta',
  url: 'http://netrauta-dev.54proxy.com',
  autoCompleteQuest: 'AutoComplete',
  searchQuest: 'Search',
  similarProductsQuest: 'SimilarProducts',
  createEventsQuest: 'CreateEvents',
  filters: [{
   'Name': 'Kategorier',
   'RequestParameter': 'Faceting.Categories',
   'ResponseParameter': 'Categories'
  }, {
   'Name': 'Märken',
   'RequestParameter': 'Faceting.Brands',
   'ResponseParameter': 'Brands'
  }],
  autoCompletePageSize: 8,
  directResultsPageSize: 24,
  recommendedResultsPageSize: 12,
  continousScrolling: false,
  instantSearch: false,
  devMode: true,
  cacheAutoComplete: false,
  autoCompleteFacetingParameter: 'Faceting.Categories',
  productTitleAttribute: 'productName',
  productDescriptionAttribute: 'Description',
  productImageUrlAttributes: ['imageURL'],
  productImageUrl: '$1',
  use26Request: true,
  showValues: true
};

let render = renderFunc(config, guiConfig);
lib.setConfig({url: config.url});

// init eventhandlers
$(document).ready(function () {
  

  // $('a#user').click(function() {
  //   lib.getRandomUserId();
  // });
  
  function doSearch(event) {
    if (event.keyCode === 13) {
      demo.search({
        query: $(guiConfig.inputSearch).val(),
        clearFilters: true,
        clearSearch: true,
        preventReSearch: false,
        instant: false,
        page: 0
      });
      $(guiConfig.inputSearch).autocomplete('close');
    }
  }

  render.initFacetting();

  $( guiConfig.inputSearch ).autocomplete({
    source:  function( req, res ) {
      demo.autocomplete(req, res);
    },
    minLength: 2,
    select: function( event, ui ) {
      $(guiConfig.inputSearch).unbind('keyup', doSearch);
      demo.search({
        clearFilters: true,
        instant: false,
        clearSearch: true,
        query: ui.item.value,
        facet: ui.item.facet
      });
    },
    response: function( event, ui ) {
      $(guiConfig.inputSearch).bind('keyup', doSearch);
    },
    open: function() {
      $( this ).removeClass( 'ui-corner-all' ).addClass( 'ui-corner-top' );
    },
    close: function() {
      $( this ).removeClass( 'ui-corner-top' ).addClass( 'ui-corner-all' );
    }
  });

  $(guiConfig.buttonSearch).click(doSearch);
  $(guiConfig.inputSearch).bind('keyup', doSearch);
  $(guiConfig.inputSearch).focus();


});


var utils = require('./utils.js');

var demo = {
  autoCompleteQueries: [],
  fetchingAutoComplete: false,
  instantTimer: null,
  runningACRequests: 0,

  activeIndex: -1,
  filters: {},
  autocompleteCache: {},
  visibleFilterDivs: {},
  previousSearch: {},


  createEvent: function(entity, eventType) {

    var req = {
      EntityType: entity.EntityType, 
      ExternalId: entity.ExternalId,
      Events: [event],
      QuestName: config.createEventsQuest,
      Type: eventType
    };

    lib.getResponse(req, function(response) {

      if (!response.success && config.devMode) {
        console.log(response.errorMessage);
      }

    });

  },

  getAutoCompeteRequest: function (options) {

    var req = {
      QuestName: config.autoCompleteQuest,
      QueryString: options.query
    };

    if (config.autoCompletePageSize > 0) {
        req.AutoComplete_FromIndex = 0;
        req.AutoComplete_ToIndex = config.autoCompletePageSize;
    }

    return (req);
  },

  previousSearch: {},

  autocomplete: function (req, res) {

    var req,
      self = this,
      cache = this.autocompleteCache; 

    function processResponse (response) {

      if (!response.success && config.DevMode) {
        alert(response.errorMessage);
      }

      var data = response.data;

      if (data.AutoComplete.length > 0) {
        res(self.formatAutoCompleteData(data));
      } else {
        res([]);
      }
    }

    if (cache[req.term]) {
      processResponse(cache[req.term]);
    }

    req = this.getAutoCompeteRequest({query: req.term});

    lib.getResponse(req).then(function(response) {

      cache[req.term] = response;

      processResponse(response);

    });

  },

  formatAutoCompleteData: function (data) {

    var ret, facets; 

    ret = data.AutoComplete.map( (x) => {
      return { 
        value: x.Key, 
        label: x.Key
      };
    }); 

    ret = ret.filter( x => (x.value !== data.AutoCompleteFacetingString) );

    facets = data.AutoCompleteFacets.map( x => { 
      return {
        label: data.AutoCompleteFacetingString + ' ' + 'in' + ' ' + x.Key,
        value: data.AutoCompleteFacetingString, 
        facet: x.Key
      };
    });

    ret.unshift(...facets);

    return ret;
  },

  getSearchRequest: function (options) {
    var req = {
      QuestName: config.searchQuest,
      QueryString: options.query,
      RelatedQueries_FromIndex: 0,
      RelatedQueries_ToIndex: 5,
      PreventReSearch: options.preventReSearch || false
    };

    if (config.directResultsPageSize > 0) {
      req.DirectResults_FromIndex = config.directResultsPageSize * options.page;
      req.DirectResults_ToIndex = (options.page + 1) * config.directResultsPageSize - 1;
    }

    if (config.recommendedResultsPageSize > 0) {
      req.RecommendedResults_FromIndex = config.recommendedResultsPageSize * options.page;
      req.RecommendedResults_ToIndex = (options.page + 1) * config.recommendedResultsPageSize - 1;
    }

    for (var i = 0; i < config.filters.length; i++) {
      if (this.filters[config.filters[i].RequestParameter]) {
        req[config.filters[i].RequestParameter] = this.filters[config.filters[i].RequestParameter];
      }
    }

    return req;
  },


  search: function(options = {}) {

    var req = {},
      self = this,
      isContinuation;

    if (options.clearFilters) {
      this.clearFilters();
    }

    if (options.clearSearch) {
      render.clearSearch();
    }    

    options = {
      instant: options.instant || false,
      preventReSearch: options.preventReSearch || false,
      page: options.page || 0,
      query: options.query
    };

    this.previousSearch = { ...options };

    isContinuation = options.page > 0 && config.continousScrolling;

    if (!isContinuation) {
      render.hidePopup();

      if(!options.instant) {
        render.hideAutocomplete();
      }
    }

    req = this.getSearchRequest(options);

    // utils.setHash({
    //   config: config.Name,
    //   page: req.search,
    //   query: query
    // });

    $(guiConfig.inputSearch).val(options.query);

    lib.getResponse(req).then( function(response) {

        if (!response.success && config.DevMode) {
          alert(response.errorMessage);
        }

        var data = response.data;

        self.previousSearch.totalItems = data.DirectResults_TotalItems;

        render.clearSearch(isContinuation);

        if (!data.MakesSense) {
          render.showMakesNoSense(data.DirectResults, data.SpellingSuggestions, options.query, self.search.bind(self));
        }

        if (data.ReSearchQueryString) {
          render.showReSearch(data.ReSearchQueryString, options.query, self.search.bind(self));
        }

        if (data.RelatedQueries && data.RelatedQueries.length > 0) {
          render.addRelated(data.RelatedQueries, self.search.bind(self));
        }

        if (data.DirectResults && data.DirectResults.length > 0) {
          render.directResults(data.DirectResults, data.DirectResults_TotalItems, isContinuation, self.createEvent);
        }

        if (data.RecommendedResults && data.RecommendedResults.length > 0) {
          render.recommendedResults(data.RecommendedResults, isContinuation, self.createEvent);
        } else if (options.page < 1) {
          render.noRecommendedResults();
        }

        self.updateFilters(data);

        if (config.continousScrolling) {
          this.displayMore();
        } else if (data.DirectResults_TotalItems > config.directResultsPageSize) {
          self.updatePaging(data.DirectResults_TotalItems, self.previousSearch, self.search.bind(self));
        }

      });
// .catch( function (err) {
//         console.log('Error when processing response:')
//         console.log(err);
//       });

  },

  updatePaging: function (totalItems, prevSearch, searchCallback) {

    var page = prevSearch.page;

    function showPage(p) {
      if (p < 2)
          return 'show';

      if (p > pages - 3)
          return 'show';

      if (p > page - 2 && p < page + 2)
          return 'show';

      if (p == 2)
          return 'dots';
      
      if (p == pages - 3 && page != 0 && page != pages-1)
          return 'dots';

      return 'hide';
    }

    var pages = Math.ceil(totalItems / config.directResultsPageSize);

    var pagesDiv = $('<div/>').addClass('pages').appendTo($('div#directresults'));

    var i = 0;
    for ( i; i < pages; i++) {

      var show = showPage(i);

      if (show == 'show') {

        $('<a/>').html((i + 1)).data('page', i).addClass(page==i?'selected':'').click(function() {

            searchCallback({
              page: $(this).data('page'),
              ...prevSearch
            });

        }).appendTo(pagesDiv);
      } else if (show == 'dots') {
          $('<span>...</span>').appendTo(pagesDiv);
      }
    }

  },

  displayMore: function() {
    //there are more results available
    
    var ps = this.previousSearch;

    if (this.isBottomVisible()) {

      if (ps.totalItems > (ps.page + 1) * config.directResultsPageSize) {
        this.search({
          query: ps.Query, 
          instant: false, 
          preventReSearch: ps.PreventReSearch, 
          page: ps.Page + 1
        });
      }
      else if (ps.otalItems > config.directResultsPageSize && $(config.directResults).find('div.endofresults').length === 0) {
        $(config.directResults).append($('<div/>').addClass('endofresults').html('No more results'));
      }
    }
  },

  updateFilters: function (data) {

    var self = this;

    for (var i = 0; i < config.filters.length; i++) {

      $('div#filter_' + config.filters[i].Name).empty();

      var data = data[config.filters[i].ResponseParameter];

      if (data && data.length > 0) {

        var filterArray = this.filters[config.filters[i].RequestParameter];

        if (!filterArray) {
          filterArray = [];
        }

        var filterDiv = $('div#filter_' + config.filters[i].Name);
        var div = $('<div/>').addClass('alwaysvisible').appendTo(filterDiv);

        for (var j = 0; j < data.length; j++) {
          
          if (j == 5) {

            div = $('<div/>').addClass('hideable').appendTo(filterDiv);

            if (this.visibleFilterDivs[config.filters[i].Name]) {
              div.show();
            }

            $('<a/>').html(self.visibleFilterDivs[config.filters[i].Name]?'Hide':'Show all').addClass('showhide').data('div', div).data('filterName',config.filters[i].Name).click(function() {

              if ($(this).data('div').is(':visible')) {

                self.visibleFilterDivs[$(this).data('filterName')] = false;

                $(this).data('div').hide();
                $(this).html('Show all');

              } else {

                self.visibleFilterDivs[$(this).data('filterName')] = true;

                $(this).data('div').show();
                $(this).html('Hide');
              }
            })
            .appendTo(filterDiv);
          }

          div.append(
            $('<a/>')
              .html(data[j].Key + ' (' + data[j].Value + ')')
              .data('filterkey', config.filters[i].RequestParameter)
              .data('filtervalue', data[j].Key)
              .click(function () {
                if (!$(this).hasClass('selected')) {
                  self.addFilter($(this).data('filterkey'), $(this).data('filtervalue'));
                  $(this).addClass('selected');
                  self.searchAgain();
                } else {
                  self.removeFilter($(this).data('filterkey'), $(this).data('filtervalue'));
                  $(this).removeClass('selected');
                  self.searchAgain();
                }
              })
              .addClass(filterArray.indexOf(data[j].Key) > -1 ? 'selected' : '')
          );
        }
      }
    }
  },



    // JustSetHash: null,

    // SetHash: function(newHash) {
    //   this.JustSetHash = newHash;
    //   location.hash = '#' + newHash;
    // },


  isBottomVisible: function() {
    var scroll = $(window).scrollTop();
    var windowHeight = $(window).height();

    var height = $(config.directResults).outerHeight() + $(config.directResults).offset().top;

    return (scroll + windowHeight) >= height;
  },

  

  // hashChanged: function(previousHash, currentHash) {

  //   if (currentHash) {

  //     currentHash = decodeURI(currentHash);

  //     var moveFunc = function() {
  //       var type = utils.getHashValue('page', currentHash);

  //       if (type === 'search') {

  //         var query = this.getHashValue('query', currentHash);
  //         this.search(query, false, false, 0);
  //       }
  //     };

  //     //make sure we dont do anything if the hash was set by code, not the user
  //     if (currentHash !== this.justSetHash) {

  //       var configName = this.getHashValue('config', currentHash);

  //       //no demo config loaded or new config does not match
  //       // ???
  //       if ( config === null || configName !== config.Name) {
  //         this.loadDemoConfig(configName, moveFunc);
  //       }
  //       else {
  //         moveFunc();
  //       }
  //     }
  //   }
  // }



  clearFilters: function() {
    this.filters = {};
  },

  searchAgain: function() {
//    Demo.Search(Demo.PreviousSearch.Query, false, Demo.PreviousSearch.PreventReSearch, 0);
    this.search({clearSearch: true, ...this.previousSearch});
  },

  addFilter: function(key, value) {

    if (!this.filters[key]) {
      this.filters[key] = [];
    }

    this.filters[key].push(value);

  },

  removeFilter: function(key, value) {

    var param = this.filters[key];

    if (!param) {
      return;
    }

    var index = param.indexOf(value);

    if (index > -1) {
      param.splice(index, 1);
    }

  }


};
