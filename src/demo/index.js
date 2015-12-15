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
  filtersContainer: 'div#filters-wrapper',
  autocompleteContainer: 'div#autocomplete',
  searchButtonContainer: 'div.form-search button',
  directResultsContainer: 'div#products-wrapper',
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
  devMode: false,
  cacheAutoComplete: false,
  autoCompleteFacetingParameter: 'Faceting.Categories',
  productTitleAttribute: 'productName',
  productDescriptionAttribute: 'Description',
  productImageUrlAttributes: ['imageURL'],
  productImageUrl: '$1',
  use26Request: true,
};

let render = renderFunc(config, guiConfig);
lib.setConfig({url: config.url});

// init eventhandlers
$(document).ready(function () {
  

  // $('a#user').click(function() {
  //   lib.getRandomUserId();
  // });

  $(guiConfig.buttonSearch).click( function() {
    demo.search({
        query: $(guiConfig.inputSearch).val(),
        clearFilters: true,
        instant: false,
        preventReSearch: false,
        page: 0
      });
  }).on('keyup', function (event) {
    debugger;
    demo.search({
      query: $(guiConfig.inputSearch).val(),
      clearFilters: true,
      instant: false,
      preventReSearch: false,
      page: 0
    });
  });

  render.initFacetting();

  $( guiConfig.inputSearch ).autocomplete({
    source:  function( req, res ) {
      demo.autocomplete(req, res);
    },
    minLength: 2,
    select: function( event, ui ) {
      demo.search({
        clearSearch: true,
        query: ui.item.value,
        facet: ui.item.facet
      });
    },
    open: function() {
      $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    },
    close: function() {
      $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    }
  });

  $( guiConfig.inputSearch ).focus();


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

  getAutoCompeteRequest: function (options) {

    var req = {
      QuestName: config.autoCompleteQuest,
      QueryString: options.query
    };

    if (config.autoCompletePageSize > 0) {
        req.AutoComplete_FromIndex = 0;
        req.AutoComplete_ToIndex = config.autoCompletePageSize;
    }

    // returns promise
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
      if (this.filters[config.filters[i].requestParameter]) {
        req[config.filters[i].requestParameter] = this.filters[config.filters[i].requestParameter];
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

        self.previousSearch.totalItems = response.data.DirectResults_TotalItems;

        render.clearSearch(isContinuation);

        if (!response.data.MakesSense) {
          render.showMakesNoSense(response.data.DirectResults, response.data.SpellingSuggestions, options.query, self.search.bind(self));
        }

        if (response.data.ReSearchQueryString) {
          render.showReSearch(response.data.ReSearchQueryString, options.query, self.search.bind(self));
        }

        if (response.data.RelatedQueries && response.data.RelatedQueries.length > 0) {
          render.addRelated(response.data.RelatedQueries, self.search.bind(self));
        }

        if (response.data.DirectResults && response.data.DirectResults.length > 0) {
          render.directResults(response.data.DirectResults, response.data.DirectResults_TotalItems, isContinuation);
        }

        if (response.data.RecommendedResults && response.data.RecommendedResults.length > 0) {
          render.recommendedResults(response.data.RecommendedResults, isContinuation);
        } else if (options.page < 1) {
          render.noRecommendedResults();
        }

        // updateFilters();

        // updateContinousScroll();
      });
// .catch( function (err) {
//         console.log('Error when processing response:')
//         console.log(err);
//       });

  },

  updateContinousScroll: function () {
    
        //check to automatically display more if continousscrolling, otherwise just show paging buttons
        if(demoConfig.ContinousScrolling)
            Demo.DisplayMore();
        else if (response.data.DirectResults_TotalItems > demoConfig.DirectResultsPageSize) {

            var pages = Math.ceil(response.data.DirectResults_TotalItems / demoConfig.DirectResultsPageSize);

            function showPage(p) {
                if (p < 2)
                    return "show";

                if (p > pages - 3)
                    return "show";

                if (p > page - 2 && p < page + 2)
                    return "show";

                if (p == 2)
                    return "dots";
                
                if (p == pages - 3 && page != 0 && page != pages-1)
                    return "dots";

                return "hide";
            }

            

            var pagesDiv = $("<div/>").addClass("pages").appendTo($("div#directresults"));

            for (var i = 0; i < pages; i++) {

                var show = showPage(i);

                if (show == "show") {

                    $("<a/>").html((i + 1)).data("page", i).addClass(page==i?"selected":"").click(function() {

                        Demo.Search(query, false, preventReSearch, $(this).data("page"));

                    }).appendTo(pagesDiv);
                }
                else if (show == "dots") {
                    $("<span>...</span>").appendTo(pagesDiv);
                }
            }

        }
  },



  updateFilters: function () {

        for (var i = 0; i < config.filters.length; i++) {

            $("div#filter_" + config.filters[i].Name).empty();

            var data = response.data[config.filters[i].ResponseParameter];

            if (data && data.length > 0) {

                var filterArray = this.filters[config.filters[i].RequestParameter];
                if (!filterArray)
                    filterArray = [];

                var filterDiv = $("div#filter_" + config.filters[i].Name);

                var div = $("<div/>").addClass("alwaysvisible").appendTo(filterDiv);

                for (var j = 0; j < data.length; j++) {
                    
                    if (j == 5) {

                        div = $("<div/>").addClass("hideable").appendTo(filterDiv);

                        if (Demo.VisibleFilterDivs[config.filters[i].Name])
                            div.show();

                        $("<a/>").html(Demo.VisibleFilterDivs[config.filters[i].Name]?"Hide":"Show all").addClass("showhide").data("div", div).data("filterName",config.filters[i].Name).click(function() {

                            if ($(this).data("div").is(":visible")) {

                                Demo.VisibleFilterDivs[$(this).data("filterName")] = false;

                                $(this).data("div").hide();
                                $(this).html("Show all");
                            }
                            else {
                                
                                Demo.VisibleFilterDivs[$(this).data("filterName")] = true;

                                $(this).data("div").show();
                                $(this).html("Hide");
                            }
                            
                            

                        }).appendTo(filterDiv);

    
                        
                        
                    }

                    div.append(
                        $("<a/>")
                            .html(data[j].Key + " (" + data[j].Value + ")")
                            .data("filterkey", config.filters[i].RequestParameter)
                            .data("filtervalue", data[j].Key)
                            .click(function () {
                                if (!$(this).hasClass("selected")) {
                                    Demo.AddFilter($(this).data("filterkey"), $(this).data("filtervalue"));
                                    $(this).addClass("selected");
                                    Demo.SearchAgain();
                                } else {
                                    Demo.RemoveFilter($(this).data("filterkey"), $(this).data("filtervalue"));
                                    $(this).removeClass("selected");
                                    Demo.SearchAgain();
                                }
                            })
                            .addClass(filterArray.indexOf(data[j].Key) > -1 ? "selected" : "")
                    );
                }

            }
        }

    },

    // SearchAgain: function() {
    //     Demo.Search(Demo.PreviousSearch.Query,false,Demo.PreviousSearch.PreventReSearch,0);
    // },

    // AddFilter: function(requestParameter, value) {

    //     if (!Demo.Filters[requestParameter])
    //         Demo.Filters[requestParameter] = [];

    //     Demo.Filters[requestParameter].push(value);
        
    // },
    
    // RemoveFilter: function (requestParameter, value) {

    //     if (!Demo.Filters[requestParameter])
    //         Demo.Filters[requestParameter] = [];
        
    //     var index = Demo.Filters[requestParameter].indexOf(value);
        
    //     if (index > -1) {
    //         Demo.Filters[requestParameter].splice(index, 1);
    //     }

    // },

    // CreateEvent: function(entity, eventType) {

    //   var event = new Loop54.Event(eventType, new Loop54.Entity(entity.EntityType, entity.ExternalId), 1, 0);

    //   var options = new Loop54.RequestOptions(!demoConfig.Use26Request);
    //   var request = new Loop54.Request('CreateEvents',options);
    //   request.setValue('Events', [event]);

    //   request.getResponse(demoConfig.Url, function(response) {

    //     if (!response.success && config.DevMode) {
    //       console.log(response.errorMessage);
    //     }

    //   });

    // },

    // JustSetHash: null,

    // SetHash: function(newHash) {
    //   this.JustSetHash = newHash;
    //   location.hash = '#' + newHash;
    // },


    // isBottomVisible: function() {
    //   var scroll = $(window).scrollTop();
    //   var windowHeight = $(window).height();

    //   var height = $(config.directResultsContainer).outerHeight() + $(config.directResultsContainer).offset().top;

    //   return (scroll + windowHeight) >= height;
    // },

    // displayMore: function() {

    //   //there are more results available
    //   if (this.isBottomVisible()) {

    //     if (this.PreviousSearch.TotalItems > (this.PreviousSearch.Page + 1) * config.DirectResultsPageSize) {
    //       this.search(this.PreviousSearch.Query, false, this.PreviousSearch.PreventReSearch, this.PreviousSearch.Page + 1);
    //     }
    //     else if (this.PreviousSearch.TotalItems > config.DirectResultsPageSize && $(config.directResultsContainer).fing('div.endofresults').length === 0) {
    //       $(config.directResultsContainer).append($('<div/>').addClass('endofresults').html('No more results'));
    //     }
    //   }
    // },



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
    this.search(this.previousSearch);
  },

  addFilter: function(key, value) {
    var param = this.filters[key];

    param = param || [];

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
