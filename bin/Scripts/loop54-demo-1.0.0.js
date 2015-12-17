(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/*globals $ */

'use strict'

// ES5 style javascript: include lib on page and assume script is imported and in global scope: global.Loop54
;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _render = require('./render.js');

var _render2 = _interopRequireDefault(_render);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var lib = global.Loop54;

// ES6 or using requre.js: import/require lib and use
//import lib from '../lib/index.js';

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
  related: 'div#related'
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
  continousScrolling: true,
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

var render = (0, _render2.default)(config, guiConfig);
lib.setConfig({ url: config.url });

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

  $(guiConfig.inputSearch).autocomplete({
    source: function source(req, res) {
      demo.autocomplete(req, res);
    },
    minLength: 2,
    select: function select(event, ui) {
      event.preventDefault();
      $(guiConfig.inputSearch).unbind('keyup', doSearch);
      demo.search({
        clearFilters: true,
        instant: false,
        clearSearch: true,
        query: ui.item.value,
        facet: ui.item.facet
      });
    },
    response: function response(event, ui) {
      event.stopPropagation();
      $(guiConfig.inputSearch).bind('keyup', doSearch);
    },
    open: function open() {
      $(this).removeClass('ui-corner-all').addClass('ui-corner-top');
    },
    close: function close() {
      $(this).removeClass('ui-corner-top').addClass('ui-corner-all');
    }
  });

  $(guiConfig.buttonSearch).click(doSearch);
  $(guiConfig.inputSearch).bind('keyup', doSearch);
  $(guiConfig.inputSearch).focus();

  $(window).bind("scroll", function () {
    demo.displayMore();
  });
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

  createEvent: function createEvent(entity, eventType) {

    var req = {
      EntityType: entity.EntityType,
      ExternalId: entity.ExternalId,
      Events: [event],
      QuestName: config.createEventsQuest,
      Type: eventType
    };

    lib.getResponse(req, function (response) {

      if (!response.success && config.devMode) {
        console.log(response.errorMessage);
      }
    });
  },

  getAutoCompeteRequest: function getAutoCompeteRequest(options) {

    var req = {
      QuestName: config.autoCompleteQuest,
      QueryString: options.query
    };

    if (config.autoCompletePageSize > 0) {
      req.AutoComplete_FromIndex = 0;
      req.AutoComplete_ToIndex = config.autoCompletePageSize;
    }

    return req;
  },

  previousSearch: {},

  autocomplete: function autocomplete(req, res) {

    var req,
        self = this,
        cache = this.autocompleteCache;

    function processResponse(response) {

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

    req = this.getAutoCompeteRequest({ query: req.term });

    lib.getResponse(req).then(function (response) {

      cache[req.term] = response;

      processResponse(response);
    });
  },

  formatAutoCompleteData: function formatAutoCompleteData(data) {
    var _ret;

    var ret, facets;

    ret = data.AutoComplete.map(function (x) {
      return {
        value: x.Key,
        label: x.Key
      };
    });

    ret = ret.filter(function (x) {
      return x.value !== data.AutoCompleteFacetingString;
    });

    facets = data.AutoCompleteFacets.map(function (x) {
      return {
        label: data.AutoCompleteFacetingString + ' ' + 'in' + ' ' + x.Key,
        value: data.AutoCompleteFacetingString,
        facet: x.Key
      };
    });

    (_ret = ret).unshift.apply(_ret, _toConsumableArray(facets));

    return ret;
  },

  getSearchRequest: function getSearchRequest(options) {
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

  search: function search() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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

    this.previousSearch = _extends({}, options);

    isContinuation = options.page > 0 && config.continousScrolling;

    if (!isContinuation) {
      render.hidePopup();

      if (!options.instant) {
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

    lib.getResponse(req).then(function (response) {

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
        self.displayMore();
      } else if (data.DirectResults_TotalItems > config.directResultsPageSize) {
        self.updatePaging(data.DirectResults_TotalItems, options.page, self.previousSearch, self.search.bind(self));
      }
    });
    // .catch( function (err) {
    //         console.log('Error when processing response:')
    //         console.log(err);
    //       });
  },

  updatePaging: function updatePaging(totalItems, page, prevSearch, searchCallback) {

    function showPage(p) {
      if (p < 2) return 'show';

      if (p > pages - 3) return 'show';

      if (p > page - 2 && p < page + 2) return 'show';

      if (p == 2) return 'dots';

      if (p == pages - 3 && page != 0 && page != pages - 1) return 'dots';

      return 'hide';
    }

    var pages = Math.ceil(totalItems / config.directResultsPageSize);

    var pagesDiv = $('<div/>').addClass('pages').appendTo($('div#directresults'));

    var i = 0;
    for (i; i < pages; i++) {

      var show = showPage(i);

      if (show == 'show') {

        $('<a/>').html(i + 1).data('page', i).addClass(page == i ? 'selected' : '').click(function () {

          searchCallback(_extends({
            page: $(this).data('page')
          }, prevSearch));
        }).appendTo(pagesDiv);
      } else if (show == 'dots') {
        $('<span>...</span>').appendTo(pagesDiv);
      }
    }
  },

  displayMore: function displayMore() {
    //there are more results available

    var ps = this.previousSearch;

    if (this.isBottomVisible()) {

      if (ps.totalItems > (ps.page + 1) * config.directResultsPageSize) {
        this.search({
          query: ps.query,
          instant: false,
          preventReSearch: ps.preventReSearch,
          page: ps.Page + 1
        });
      } else if (ps.otalItems > config.directResultsPageSize && $(guiConfig.directResults).find('div.endofresults').length === 0) {
        $(config.directResults).append($('<div/>').addClass('endofresults').html('No more results'));
      }
    }
  },

  updateFilters: function updateFilters(data) {

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

            $('<a/>').html(self.visibleFilterDivs[config.filters[i].Name] ? 'Hide' : 'Show all').addClass('showhide').data('div', div).data('filterName', config.filters[i].Name).click(function () {

              if ($(this).data('div').is(':visible')) {

                self.visibleFilterDivs[$(this).data('filterName')] = false;

                $(this).data('div').hide();
                $(this).html('Show all');
              } else {

                self.visibleFilterDivs[$(this).data('filterName')] = true;

                $(this).data('div').show();
                $(this).html('Hide');
              }
            }).appendTo(filterDiv);
          }

          div.append($('<a/>').html(data[j].Key + ' (' + data[j].Value + ')').data('filterkey', config.filters[i].RequestParameter).data('filtervalue', data[j].Key).click(function () {
            if (!$(this).hasClass('selected')) {
              self.addFilter($(this).data('filterkey'), $(this).data('filtervalue'));
              $(this).addClass('selected');
              self.searchAgain();
            } else {
              self.removeFilter($(this).data('filterkey'), $(this).data('filtervalue'));
              $(this).removeClass('selected');
              self.searchAgain();
            }
          }).addClass(filterArray.indexOf(data[j].Key) > -1 ? 'selected' : ''));
        }
      }
    }
  },

  // JustSetHash: null,

  // SetHash: function(newHash) {
  //   this.JustSetHash = newHash;
  //   location.hash = '#' + newHash;
  // },

  isBottomVisible: function isBottomVisible() {
    var scroll = $(window).scrollTop();
    var windowHeight = $(window).height();

    var height = $(guiConfig.directResults).outerHeight() + $(guiConfig.directResults).offset().top;

    return scroll + windowHeight >= height;
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

  clearFilters: function clearFilters() {
    this.filters = {};
  },

  searchAgain: function searchAgain() {
    //    Demo.Search(Demo.PreviousSearch.Query, false, Demo.PreviousSearch.PreventReSearch, 0);
    this.search(_extends({ clearSearch: true }, this.previousSearch));
  },

  addFilter: function addFilter(key, value) {

    if (!this.filters[key]) {
      this.filters[key] = [];
    }

    this.filters[key].push(value);
  },

  removeFilter: function removeFilter(key, value) {

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./render.js":2,"./utils.js":3}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// requires jQuery to be in global scope
/*globals $ */

var lib = global.Loop54;

// let utils = require('utils');

var render = function render(config, guiConfig) {

  function initFacetting() {

    var $filters = $(guiConfig.filters);

    $filters.empty();

    for (var i = 0; i < config.filters.length; i++) {
      $filters.append($('<h2/>').html(config.filters[i].Name)).append($('<div/>').attr('id', 'filter_' + config.filters[i].Name).addClass('filterdiv'));
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

    showMakesNoSense: function showMakesNoSense(directResults, spellingSuggestions, query, searchCallback) {

      $(guiConfig.makesSense).show();

      $(guiConfig.makesSenseHeader).html("We did not understand the query \"" + query + "\". ");

      if (directResults && directResults.length > 0) {
        $(guiConfig.makesSenseHeader).append($("<span>The results below are approximate.</span>"));
      }

      if (spellingSuggestions && spellingSuggestions.length > 0) {

        $(guiConfig.spellingSuggestions).html("Did you mean to search for: ");

        for (var i = 0; i < spellingSuggestions.length; i++) {
          $(guiConfig.spellingSuggestions).append($('<a/>').html(spellingSuggestions[i].Key).data('query', spellingSuggestions[i].Key).click(function () {
            searchCallback({
              query: $(this).data('query'),
              clearFilters: true
            });
          }));
        }
      }
    },

    showReSearch: function showReSearch(reSearchString, originalQuery, searchCallback) {
      debugger;
      $(guiConfig.reSearch).show().html('We assumed you meant \'' + reSearchString + '\'. Can you blame us?<br /><br />Search instead for ').append($('<a />').html(originalQuery).click(function () {
        searchCallback({
          query: $(this).data('query'),
          clearFilters: true,
          instant: false,
          preventReSearch: true
        });
      }));
    },

    addRelated: function addRelated(related, searchCallback) {

      function onClick() {
        searchCallback({
          query: $(this).data('query'),
          clearFilters: true,
          instant: false,
          preventReSearch: false
        });
      }

      for (var i = 0; i < related.length; i++) {

        $(guiConfig.related).append($('<a/>').html(related[i].Key).data('query', related[i].Key).click(onClick));
      }

      $(guiConfig.related).show();
    },

    directResults: function directResults(_directResults, totalItems, isContinuation, createEventCallback) {

      if (!isContinuation) {
        $(guiConfig.directResults).append($('<h2>We found ' + totalItems + ' results</h2>'));
      }

      for (var i = 0; i < _directResults.length; i++) {
        this.renderEntity(guiConfig.directResults, _directResults[i].Key, _directResults[i].Value, createEventCallback);
      }
    },

    recommendedResults: function recommendedResults(_recommendedResults, isContinuation, createEventCallback) {

      if (!isContinuation) {
        $(guiConfig.recommendedResults).append($('<h2>You might also like</h2>'));
      }

      for (var i = 0; i < _recommendedResults.length; i++) {
        this.renderEntity(guiConfig.recommendedResults, _recommendedResults[i].Key, _recommendedResults[i].Value, createEventCallback);
      }
    },

    noRecommendedResults: function noRecommendedResults() {
      $(guiConfig.recommendedResults).hide();
      $(guiConfig.directResults).addClass('fillout');
    },

    clearSearch: function clearSearch(keepResults) {

      if (!keepResults) {
        $(guiConfig.directResults).empty().removeClass('fillout');

        $(guiConfig.recommendedResults).empty().show();
      }

      $(guiConfig.makesSense).hide();
      $(guiConfig.spellingSuggestions).empty();
      $(guiConfig.research).hide();
      $(guiConfig.related).empty().hide();
    },

    hidePopup: function hidePopup() {
      $('div#popupbg').hide();
      $('div.entitypopup').remove();
    },

    hideAutocomplete: function hideAutocomplete() {
      $('div#autocomplete').hide();
    },

    renderEntity: function renderEntity(element, entity, value, createEventCallback) {

      var imgUrl = replaceImageUrl(entity),
          entityTitle = getEntityTitle(entity);
      var self = this;

      var div = $('<div/>').addClass('entity').data('entity', entity).data('value', value).click(function () {
        self.showEntity($(this).data('entity'), $(this).data('value'), createEventCallback);
      });

      if (config.showValues) {
        div.attr('title', value);
      }

      var a = $('<a/>').appendTo(div);
      var imgDiv = $('<div/>').appendTo(a);
      $('<img/>').attr('src', imgUrl).appendTo(imgDiv).on('load', function () {

        if ($(this).width() > $(this).height()) {
          $(this).css('width', '100%');
        } else {
          $(this).css('height', '100%');
        }
      }).on('error', function () {
        $(this).remove();
      });

      $('<span/>').html(entityTitle).appendTo(a);

      div.appendTo($(element));
    },

    showEntity: function showEntity(entity, value, createEventCallback) {

      // Demo.SetHash("config=" + demoConfig.Name + "&page=entity&id=" + entity.ExternalId);

      createEventCallback(entity, 'click');

      $('div#popupbg').show();
      $('div.entitypopup').remove();

      var div = $('<div/>').addClass('entitypopup').appendTo($('body')).css('top', $(window).scrollTop() + 100);

      $('<a/>').addClass('close').html('X').click(function () {
        $('div#popupbg').hide();
        $('div.entitypopup').remove();
      }).appendTo(div);

      //main stuff

      $('<img/>').attr('src', replaceImageUrl(entity)).appendTo(div).on('error', function () {
        $(this).remove();
      });

      $('<h2/>').html(getEntityTitle(entity)).appendTo(div);

      $('<div/>').addClass('description').html(getEntityDescription(entity)).appendTo(div);

      $('<a/>').addClass('button').html('Purchase').click(function () {
        createEventCallback(entity, 'purchase');
        $(this).off('click').addClass('inactive');
      }).appendTo(div);

      //extra info
      if (!config.devMode) {
        $('<a/>').html('Show all attributes').addClass('showhide').appendTo(div).click(function () {
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

      if (config.DevMode) {
        hiddenDiv.show();
      }
    },

    initFacetting: initFacetting

  };
};

exports.default = render;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var utilityFunctions = {

  getHashValue: function getHashValue(name, hash) {

    if (!hash) {
      hash = location.hash.replace('#', '');
    }

    var split = hash.split('&');

    for (var i = 0; i < split.length; i++) {
      var pair = split[i].split('=');

      if (pair[0] === name) {
        return pair[1];
      }
    }

    return null;
  }

};

exports.default = utilityFunctions;

},{}]},{},[1]);
