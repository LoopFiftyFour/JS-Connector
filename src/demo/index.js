'use strict';

// ES5 style javascript: include lib on page and assume script is imported and in global scope: global.Loop54
// var lib = global.Loop54;

// ES6 or using requre.js: import/require lib and use

var guiConfig = {
  inputSearch: 'input#search',
  filtersContainer: 'div#filters-wrapper',
  autocompleteContainer: 'div#autocomplete',
  searchButtonContainer: 'div.form-search button',
  directResultsContainer: 'div#products-wrapper',
  directResultsContainerId: 'products-wrapper',
  breadCrumbsContainer: '#breadcrumbs-wrapper',
  queryInBreadCrumb: '#breadcrumbs-wrapper div.breadcrumbs div.block.search.current strong span'
};

var serverConfig = {
  'Name': 'Netrauta',
  'Url': 'http://netrauta-dev.54proxy.com',
  'AutoCompleteQuest': 'AutoComplete',
  'SearchQuest': 'Search',
  'SimilarProductsQuest': 'SimilarProducts',
  'CreateEventsQuest': 'CreateEvents',
  'Filters': [{
   'Name': 'Tuoteryhmät',
   'RequestParameter': 'Faceting.Categories',
   'ResponseParameter': 'Categories'
  }, {
   'Name': 'Tuotemerkit',
   'RequestParameter': 'Faceting.Brands',
   'ResponseParameter': 'Brands'
  }],
  'AutoCompletePageSize': 8,
  'DirectResultsPageSize': 24,
  'RecommendedResultsPageSize': 12,
  'ContinousScrolling': false,
  'InstantSearch': false,
  'DevMode': false,
  'CacheAutoComplete': false,
  'AutoCompleteFacetingParameter': 'Faceting.Categories',
  'ProductTitleAttribute': 'Title',
  'ProductDescriptionAttribute': 'Description',
  'ProductImageUrlAttributes': ['ImageUrl'],
  'ProductImageUrl': '$1',
  'Use26Request': true,
  'Id': '18eb1533-a1f7-4ec8-9211-a561dcf43597'
};


var render = require('./render.js')(guiConfig);




var Demo = {
    AutoCompleteQueries: [],
    FetchingAutoComplete: false,

    InstantTimer: null,

    RunningACRequests: 0,

    Keyup: function (e) {

        clearTimeout(Demo.InstantTimer);
        
        var selecteda = $("div#autocomplete a.selected");

        var input = $("input#search");
        var q = input.val();

    
        //arrowup
        if (e.keyCode == 38) {
            Demo.ActiveIndex--;
            Demo.HighLightSuggestion();

            input.val(q);

            return false;
        }

            //arrowdown
        else if (e.keyCode == 40) {
            Demo.ActiveIndex++;
            Demo.HighLightSuggestion();

            return false;
        }

            //enter
        else if (e.keyCode == 13) {

            Demo.ClearFilters();

            //go to selected in dropdown if any is selected
            if (selecteda.length > 0) {

                q = selecteda.data("query");
                var f = selecteda.data("facet");

                Demo.ClearFilters();

                if (f)
                    Demo.AddFilter(demoConfig.AutoCompleteFacetingParameter, f);

                Demo.Search(q);

                return true;

            } else {

                Demo.ClearFilters();
        
        
                Demo.Search(q);

                return true;
            }

           

            

            
        }

        if (q.length < 1) {
            Demo.ClearSuggestions();

            if (demoConfig.InstantSearch) {

                clearTimeout(Demo.InstantTimer);
                Demo.ClearSearch();
            }
                

            return true;
        }

        if (!demoConfig.CacheAutoComplete) {
            Demo.AutoCompleteQueries = [];
            Demo.ActiveIndex = -1;
        }

        //request if no cache (fill cache)
        if (Demo.AutoCompleteQueries.length == 0) {
             
            if (Demo.FetchingAutoComplete)
                return true;

          Demo.FetchingAutoComplete = true;

          var options = new Loop54.RequestOptions(!demoConfig.Use26Request);
            var request = new Loop54.Request(demoConfig.AutoCompleteQuest,options);
      

            if (demoConfig.AutoCompletePageSize > 0) {
                request.setValue("AutoComplete_FromIndex", 0);
                request.setValue("AutoComplete_ToIndex", demoConfig.AutoCompletePageSize);
            }
            request.setValue("QueryString", q);

            Demo.RunningACRequests++;
      
            request.getResponse(demoConfig.Url, function(response) {

                Demo.RunningACRequests--;

                if (Demo.RunningACRequests > 0)
                    return;

                if (!response.success && demoConfig.DevMode)
                    alert(response.errorMessage);
                

                var data = response.data.AutoComplete;

                if (data.length > 0) {


                    for (var i = 0; i < data.length; i++) {

                        Demo.AutoCompleteQueries[i] = data[i].Key;

                    }


                    if (response.data.AutoCompleteFacetingString) {

                        Demo.AutoCompleteFacetingString = response.data.AutoCompleteFacetingString;
                        Demo.AutoCompleteFacets = response.data.AutoCompleteFacets;

                    } else {
                        Demo.AutoCompleteFacetingString = null;
                        Demo.AutoCompleteFacets = {}
                    }

                    Demo.ShowAutoComplete();

                } else {
                    Demo.AutoCompleteQueries[i] = [];
                    
                    Demo.ClearSuggestions();
                }

                Demo.FetchingAutoComplete = false;
            });

            

        //if cached, filter cache
        } else {
            Demo.ShowAutoComplete();

            
        }

        if (demoConfig.InstantSearch && q.length > 2) {

           
            
            Demo.InstantTimer = setTimeout(function () {

                Demo.ClearFilters();
                Demo.Search(q,true);
            },200);
        }
            

        return false;
    },

    CreateFacetedAutoCompleteHtml: function(query, facet) {

        return query + " in <span class=\"facet\">" + facet + "</span>";

    },

    ShowAutoComplete: function () {

        if (Demo.AutoCompleteQueries.length > 0) {


            var div = $("div#autocomplete");
            div.clearQueue();
            div.empty();

            var q = $("input#search").val();

            if (Demo.AutoCompleteFacetingString) {

                for (var i = 0; i < Demo.AutoCompleteFacets.length; i++) {

      

                    var newlink = $("<a/>");
                    newlink.html(Demo.CreateFacetedAutoCompleteHtml(Demo.AutoCompleteFacetingString,Demo.AutoCompleteFacets[i].Key));
                    
                    newlink.click(function () {
                        Demo.ClearFilters();
                        
                        Demo.AddFilter(demoConfig.AutoCompleteFacetingParameter, $(this).data("facet"));
                        Demo.Search($(this).data("query"));

                        $("div#autocomplete").hide();
                    });

                    newlink.data("facet", Demo.AutoCompleteFacets[i].Key);
                    newlink.data("query", Demo.AutoCompleteFacetingString);

                    div.append(newlink);


                }

                div.append($("<div/>").addClass("divider"));

            }

            var found = false;
            var numberfound = 0;
            for (var i = 0; i < Demo.AutoCompleteQueries.length; i++) {

                var query = Demo.AutoCompleteQueries[i];

                if (!demoConfig.CacheAutoComplete || query.length >= q.length) {

                    if (!demoConfig.CacheAutoComplete || query.indexOf(q) > -1) {

                        if (!demoConfig.CacheAutoComplete || numberfound < 5) {

                            var newlink = $("<a/>");
                            newlink.html(query);
                            newlink.click(function () {
                                Demo.ClearFilters();
                                Demo.Search($(this).data("query"));
                                $("div#autocomplete").hide();
                            });
                            newlink.data("query", query);

                            div.append(newlink);

                            numberfound++;
                        }

                        found = true;
                    }

                }
            }

            Demo.HighLightSuggestion();

            if (!found)
                div.hide();
            else
                div.show();
        }

    },

    ActiveIndex: -1,
    ClearSuggestions: function () {
        $("div#autocomplete a").remove();
        $("div#autocomplete").hide();
        Demo.AutoCompleteQueries = [];
        Demo.ActiveIndex = -1;
        Demo.AutoCompleteFacets = {}
        Demo.AutoCompleteFacetingString = null;
    },

    HighLightSuggestion: function () {

        var divs = $("div#autocomplete a").removeClass("selected");

        //enbolden them
        var q = $("input#search").val();


        for (var i = 0; i < divs.length; i++) {

            var query = $(divs[i]).data("query");
            query = query.replace(q, "<span>" + q + "</span>");

            //only boldify non-faceted links
            if (!$(divs[i]).data("facet")) {

                $(divs[i]).html(query);
            } else {
                
                $(divs[i]).html(Demo.CreateFacetedAutoCompleteHtml(query,$(divs[i]).data("facet")));

            }
        }

        //highlight correct one
        if (Demo.ActiveIndex < -1)
            Demo.ActiveIndex = -1;

        if (Demo.ActiveIndex > divs.length - 1)
            Demo.ActiveIndex = divs.length - 1;

        if (Demo.ActiveIndex == -1)
            return;

        $(divs[Demo.ActiveIndex]).addClass("selected");

        

    },

    SearchHighLighted: function () {

        if (Demo.ActiveIndex < 0)
            return;

        var divs = $("div#autocomplete div.suggestion").removeClass("active");

        if (Demo.ActiveIndex > divs.length - 1)
            return;

        var input = $("input#searchbar");
        input.val($(divs[Demo.ActiveIndex]).find("div.title").html());


    },
    
    PreviousSearch: {},
    
    Search: function(query,instant,preventReSearch, page) {



        if (!page)
            page = 0;

        Demo.PreviousSearch = {
            Query: query,
            Instant: instant,
            PreventReSearch: preventReSearch,
            Page:page
        };

        clearTimeout(Demo.InstantTimer);

        var isContinuation = page > 0 && demoConfig.ContinousScrolling;

        if (!isContinuation) {

            $("div#popupbg").hide();
            $("div.entitypopup").remove();
            
            if(!instant)
                $("div#autocomplete").hide();
        }

    var options = new Loop54.RequestOptions(!demoConfig.Use26Request);
        var request = new Loop54.Request(demoConfig.SearchQuest,options);
        request.setValue("QueryString", query);

        request.setValue("RelatedQueries_FromIndex", 0);
        request.setValue("RelatedQueries_ToIndex", 5);

        if (demoConfig.DirectResultsPageSize > 0) {
            request.setValue("DirectResults_FromIndex", demoConfig.DirectResultsPageSize * page);
            request.setValue("DirectResults_ToIndex", (page+1)*demoConfig.DirectResultsPageSize-1);
        }
        if (demoConfig.RecommendedResultsPageSize > 0) {
            request.setValue("RecommendedResults_FromIndex", demoConfig.RecommendedResultsPageSize*page);
            request.setValue("RecommendedResults_ToIndex", (page+1)*demoConfig.RecommendedResultsPageSize-1);
        }

        if (preventReSearch)
            request.setValue("PreventReSearch", true);

        for (var i = 0; i < demoConfig.Filters.length; i++) {

            if (Demo.Filters[demoConfig.Filters[i].RequestParameter]) {
               
                request.setValue(demoConfig.Filters[i].RequestParameter, Demo.Filters[demoConfig.Filters[i].RequestParameter]);
            }
        }
        
        Demo.SetHash("config=" + demoConfig.Name + "&page=search&query=" + query);

        $("input#search").val(query).removeClass("gray");

        request.getResponse(demoConfig.Url, function(response) {

            if (!response.success && demoConfig.DevMode)
                alert(response.errorMessage);

            Demo.PreviousSearch.TotalItems = response.data.DirectResults_TotalItems;

            Demo.ClearSearch(isContinuation);



            if (!response.data.MakesSense) {
                $("div#nosense").show();

                $("div#nosenseheader").html("We did not understand the query \"" + query + "\". ");

                if (response.data.DirectResults && response.data.DirectResults.length > 0)
                    $("div#nosenseheader").append($("<span>The results below are approximate.</span>"));
                
                if (response.data.SpellingSuggestions && response.data.SpellingSuggestions.length > 0) {

                    $("div#spellingsuggestions").html("Did you mean to search for: ");

                    for (var i = 0; i < response.data.SpellingSuggestions.length; i++) {
                        $("div#spellingsuggestions").append(
                            $("<a/>")
                                .html(response.data.SpellingSuggestions[i].Key)
                                .data("query", response.data.SpellingSuggestions[i].Key)
                                .click(function () {
                                    Demo.ClearFilters();
                                    Demo.Search($(this).data("query"));
                                })
                        );
                    }
                }
            }
            
            if (response.data.ReSearchQueryString) {

                //backwards compatible: get array if it is array, get Key or String depending on what it is
                var reSearchString = response.data.ReSearchQueryString instanceof Array ?
                    (response.data.ReSearchQueryString[0].Key ?
                        response.data.ReSearchQueryString[0].Key :
                        response.data.ReSearchQueryString[0].String) :
                    response.data.ReSearchQueryString;

                $("div#research").show().html("We assumed you meant \"" + reSearchString + "\". Can you blame us?<br /><br />Search instead for ")
                .append(
                    $("<a />").html(query).click(function () {
                        Demo.ClearFilters();
                        Demo.Search(query, false, true);
                    })
                );
            }

            if (response.data.RelatedQueries && response.data.RelatedQueries.length > 0) {
                $("div#related").show().html("<h2>Related queries</h2>");
                
                for (var i = 0; i < response.data.RelatedQueries.length; i++) {

                    $("div#related").append(
                        $("<a/>")
                            .html(response.data.RelatedQueries[i].Key)
                            .data("query", response.data.RelatedQueries[i].Key)
                            .click(function () {
                                Demo.ClearFilters();
                                Demo.Search($(this).data("query"), false, false);
                            })
                    );
                }
            }

            if (response.data.DirectResults && response.data.DirectResults.length > 0) {

                if(!isContinuation)
                    $("div#directresults").append($("<h2>We found " + response.data.DirectResults_TotalItems + " results</h2>"));

                for (var i = 0; i < response.data.DirectResults.length; i++) {

                    Demo.RenderEntity("directresults", response.data.DirectResults[i].Key, response.data.DirectResults[i].Value);
                }


            }
            
            if (response.data.RecommendedResults && response.data.RecommendedResults.length > 0) {

                if (!isContinuation)
                    $("div#recommendedresults").append($("<h2>You might also like</h2>"));

                for (var i = 0; i < response.data.RecommendedResults.length; i++) {

                    Demo.RenderEntity("recommendedresults", response.data.RecommendedResults[i].Key, response.data.RecommendedResults[i].Value);
                }

            } else if(page<1) {
                $("div#recommendedresults").hide();
                $("div#directresults").addClass("fillout");
            }


            for (var i = 0; i < demoConfig.Filters.length; i++) {

                $("div#filter_" + demoConfig.Filters[i].Name).empty();

                var data = response.data[demoConfig.Filters[i].ResponseParameter];

                if (data && data.length > 0) {

                    var filterArray = Demo.Filters[demoConfig.Filters[i].RequestParameter];
                    if (!filterArray)
                        filterArray = [];

                    var filterDiv = $("div#filter_" + demoConfig.Filters[i].Name);

                    var div = $("<div/>").addClass("alwaysvisible").appendTo(filterDiv);

                    for (var j = 0; j < data.length; j++) {
                        
                        if (j == 5) {

                            div = $("<div/>").addClass("hideable").appendTo(filterDiv);

                            if (Demo.VisibleFilterDivs[demoConfig.Filters[i].Name])
                                div.show();

                            $("<a/>").html(Demo.VisibleFilterDivs[demoConfig.Filters[i].Name]?"Hide":"Show all").addClass("showhide").data("div", div).data("filterName",demoConfig.Filters[i].Name).click(function() {

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
                                .data("filterkey", demoConfig.Filters[i].RequestParameter)
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
        });
    },
    
    VisibleFilterDivs: {},
    
    Filters: {},
    
    ClearFilters : function() {
        Demo.Filters = {};
    },

    SearchAgain: function() {
        Demo.Search(Demo.PreviousSearch.Query,false,Demo.PreviousSearch.PreventReSearch,0);
    },

    AddFilter: function(requestParameter, value) {

        if (!Demo.Filters[requestParameter])
            Demo.Filters[requestParameter] = [];

        Demo.Filters[requestParameter].push(value);
        
    },
    
    RemoveFilter: function (requestParameter, value) {

        if (!Demo.Filters[requestParameter])
            Demo.Filters[requestParameter] = [];
        
        var index = Demo.Filters[requestParameter].indexOf(value);
        
        if (index > -1) {
            Demo.Filters[requestParameter].splice(index, 1);
        }

    },
    
    ClearSearch: function (keepResults) {

        if (!keepResults) {
            $("div#directresults").empty();
            $("div#directresults").removeClass("fillout");

            $("div#recommendedresults").empty();
            $("div#recommendedresults").show();
        }
        
        $("div#nosense").hide();
        
        $("div#spellingsuggestions").empty();
        
        $("div#research").hide();
        
        $("div#related").empty();
        $("div#related").hide();
    },
    
    CreateEvent: function(entity, eventType) {

  
        var event = new Loop54.Event(eventType, new Loop54.Entity(entity.EntityType,entity.ExternalId),1,0);

    var options = new Loop54.RequestOptions(!demoConfig.Use26Request);
        var request = new Loop54.Request("CreateEvents",options);
        request.setValue("Events", [event]);

        request.getResponse(demoConfig.Url, function(response) {

            if (!response.success && demoConfig.DevMode)
                alert(response.errorMessage);

        });

    },
    
    JustSetHash:null,
    SetHash: function(newHash) {

        Demo.JustSetHash = newHash;
        location.hash = "#" + newHash;

    },
    
    ShowEntity: function(entity, value) {

        Demo.SetHash("config=" + demoConfig.Name + "&page=entity&id=" + entity.ExternalId);

        Demo.CreateEvent(entity, "click");

        $("div#popupbg").show();

        $("div.entitypopup").remove();
        

        var div = $("<div/>").addClass("entitypopup").appendTo($("body")).css("top",$(window).scrollTop()+100);

        $("<a/>").addClass("close").html("X").click(function () {
            $("div#popupbg").hide();
            $("div.entitypopup").remove();
        }).appendTo(div);
        

        //main stuff

        $("<img/>")
            .attr("src", Demo.ReplaceImageUrl(entity))
            .appendTo(div)
            .on("error", function () {
                $(this).remove();
            });
        
        $("<h2/>").html(Demo.GetEntityTitle(entity)).appendTo(div);
        
        $("<div/>").addClass("description").html(Demo.GetEntityDescription(entity)).appendTo(div);

        $("<a/>").addClass("button").html("Purchase").click(function () {
            Demo.CreateEvent(entity, "purchase");
            $(this).off("click").addClass("inactive");
        }).appendTo(div);


        //extra info
        if (!demoConfig.DevMode)
        {
            $("<a/>").html("Show all attributes").addClass("showhide").appendTo(div).click(function() {
                $("div.entitypopup div.moreinfo").show();
                $(this).remove();
            });
        }

        var hiddenDiv = $("<div/>").addClass("moreinfo").appendTo(div);
        
        $("<span/>").html("<b>EntityType</b>: " + entity.EntityType).appendTo(hiddenDiv);
        $("<span/>").html("<b>ExternalId</b>: " + entity.ExternalId).appendTo(hiddenDiv);
        $("<span/>").html("<b>Value</b>: " + value).appendTo(hiddenDiv);

        for (var key in entity.Attributes)
        {
            $("<span/>").html("<b>" + key + "</b>: " + entity.Attributes[key]).appendTo(hiddenDiv);
        }

        if (demoConfig.DevMode)
            hiddenDiv.show();

    },
    
    RenderEntity: function(element, entity, value) {



        var div = $("<div/>").addClass("entity").data("entity", entity).data("value", value).click(function() {
            Demo.ShowEntity($(this).data("entity"), $(this).data("value"));
        });
        
        if (demoConfig.ShowValues)
            div.attr("title", value);
        
        var a = $("<a/>").appendTo(div);
        var imgDiv = $("<div/>").appendTo(a);
        $("<img/>")
            .attr("src", Demo.ReplaceImageUrl(entity))
            .appendTo(imgDiv)
            .on("load", function () {

            if ($(this).width() > $(this).height())
                $(this).css("width", "100%");
            else 
                $(this).css("height", "100%");
            })
            .on("error",function() {
                $(this).remove();
            });
        
        $("<span/>").html(Demo.GetEntityTitle(entity)).appendTo(a);

        div.appendTo($("div#" + element));
    },
    
    GetEntityTitle: function (entity) {
        
        if (entity.Attributes[demoConfig.ProductTitleAttribute])
            return entity.Attributes[demoConfig.ProductTitleAttribute][0];

        return "";
    },
    
    GetEntityDescription: function (entity) {
        
        if (entity.Attributes[demoConfig.ProductDescriptionAttribute])
            return entity.Attributes[demoConfig.ProductDescriptionAttribute][0];

        return "";
    },
    
    ReplaceImageUrl: function (entity) {

        var ret = demoConfig.ProductImageUrl;

        for (var i = 0; i < demoConfig.ProductImageUrlAttributes.length; i++) {

            var attr = demoConfig.ProductImageUrlAttributes[i];

            var attrValue="";

            if (attr == "ExternalId")
                attrValue = entity.ExternalId;
            else if (entity.Attributes[demoConfig.ProductImageUrlAttributes[i]])
                attrValue = entity.Attributes[demoConfig.ProductImageUrlAttributes[i]][0];

      //Replace doesn't like "$&" in the image url...
            ret = ret.split("$" + (i+1)).join(attrValue);
        }

        return ret;
    },
    
    InitFacetting: function() {
        
    $("div#filters").empty();
    
        for (var i = 0; i < demoConfig.Filters.length; i++) {
            $("div#filters")
                .append(
                    $("<h2/>").html(demoConfig.Filters[i].Name)
                )
                .append($("<div/>").attr("id", "filter_" + demoConfig.Filters[i].Name).addClass("filterdiv"));

        }

    },
    
    BottomVisible: function() {
        var scroll = $(window).scrollTop();
        var windowHeight = $(window).height();

        var height = $("div#directresults").outerHeight()+$("div#directresults").offset().top;

        return (scroll + windowHeight) >= height;
    },
    
    DisplayMore: function() {
        
        //there are more results available
        if (Demo.BottomVisible()) {

            if (Demo.PreviousSearch.TotalItems > (Demo.PreviousSearch.Page + 1) * demoConfig.DirectResultsPageSize)
                Demo.Search(Demo.PreviousSearch.Query, false, Demo.PreviousSearch.PreventReSearch, Demo.PreviousSearch.Page + 1);
            else if (Demo.PreviousSearch.TotalItems > demoConfig.DirectResultsPageSize && $("div#directresults div.endofresults").length == 0) {
                
                $("div#directresults").append($("<div/>").addClass("endofresults").html("No more results"));
                
            }
        }
    },
  


    HashChanged: function(previousHash,currentHash) {
  
        if (currentHash) {
  
      currentHash = decodeURI(currentHash);
  
      var moveFunc = function(){
        var type = Demo.GetHashValue("page",currentHash);
        var previousType = Demo.GetHashValue("page",previousHash);
               
                // if (previousType === "entity") {
                    // $("div#popupbg").hide();
                    // $("div.entitypopup").remove();
                // }
                if (type === "search") {
          var query = Demo.GetHashValue("query",currentHash);
                    Demo.Search(query, false, false, 0);
                }
        
      }
    
      //make sure we dont do anything if the hash was set by code, not the user
            if (currentHash !== Demo.JustSetHash) {
      
        var configName = Demo.GetHashValue("config",currentHash);
        
        //no demo config loaded or new config does not match
        if(demoConfig==null || configName!==demoConfig.Name)
          Demo.LoadDemoConfig(configName,moveFunc);
        else
          moveFunc();

                
            }
        }
    },
  
  LoadConfig:function(callback)
  {
    $.ajax(
    {
      dataType:"json",
      url:"config.json",
      success:function(data){
        config=data;
        
        callback();
      },
      error:function(data){
        $.ajax(
        {
          dataType:"json",
          url:"defaultconfig.json",
          success:function(data){
            config=data;
            
            callback();
          },
          error:function(data){
            alert("Could not load config.json or defaultconfig.json");
          }
        });
      }
    });
  },
  
  LoadDemoConfig: function(configName,callback){
  
    $.ajax(
    {
      dataType:"json",
      url:config.AdminApiUrl + "/api/Demos/actions/GetByName?name=" + configName,
      success:function(data){
      
        demoConfig=data;
        
        Demo.InitFacetting();
        
        if (demoConfig.ContinousScrolling) {
          $(window).bind("scroll", function() {

            Demo.DisplayMore();
          });
        }
        else
          $(window).unbind("scroll");
        
        callback();
      },
      error:function(data){
        
        alert("Could not load demo config " + configName);
          
      }
    });
  
  },
  
  GetHashValue: function(name,hash) {
  
    if(!hash)
      hash = location.hash.replace("#","");
  
    var split = hash.split('&');
    
        for(var i=0;i<split.length;i++)
    {
      var pair = split[i].split('=');
      
      if(pair[0]===name)
        return pair[1];
    }
    
    return null;
    
    }
};
