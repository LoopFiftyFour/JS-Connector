import core from './core.js';

global.Loop54 = (function() {
  
  var config = {
    endpoint: 'helloworld.54proxy.com'
  }

  var setConfig = function(newConfig) {
    if(!newConfig || typeof(newConfig) != 'object') { return core.returnError({ type: 'ArgumentError', data: 'Arguments missing or they have the wrong format' })}
    if(newConfig.endpoint) { newConfig.endpoint = newConfig.endpoint.replace(/^(https?):\/\/|\/(?=[^\/]*$)/g, '') }
    config = { ...config, ...newConfig }
  }

  var getConfig = function() {
    return config;
  }

  var autoComplete = function(searchTerm) {

	var args = core.getOptionsAndCallback(arguments,1);
	if(args.error) { 
		return core.returnError(args);
	}
	
	var options = args.options ? args.options : {};
	var callback = args.callback ? args.callback : null;
	
	if(typeof(searchTerm) != 'string' || searchTerm.length == 0) {
      return core.returnError({error: {type: 'ArgumentError', data: 'Search term is either missing or not a string'}}, callback)
    }

	var req = core.call(config.endpoint,'/autoComplete', {query: searchTerm, queriesOptions:options}, null, callback);

	if(!callback) {
		// if callback is missing, return a promise
		return req;
	}
  }

  var trackEvent = function(eventType, type, id, orderId, quantity, revenue) {
    // purchase, addToCart, click

    if(!eventType) { return core.returnError("eventType needs to be set, our standard events are 'click', 'addtocart' and 'purchase'") }
    if(!type) { return core.returnError("All entities needs to have a type set, usually this is 'Product' but can basically be anything") }
    if(!id) { return core.returnError("All entities needs to have an 'id' provided, this is usually the productId") }

    var event = {
      type: eventType,
      entity: {
        type: type,
        id: id
      }
    }

    // purchase event extra attributes
    if(orderId) { event['orderId'] = orderId }
    if(quantity) { event['quantity'] = parseFloat(quantity) }
    if(revenue) { event['revenue'] = parseFloat(revenue) }

    core.call(config.endpoint,'/createEvents', {events: [event]})
  }

  var trackEvents = function(events) {
    // purchase, addToCart, click

    core.call(config.endpoint,'/createEvents', {events: events})
  }

  var getRelatedEntities = function(entity, callback) {

    var args = core.getOptionsAndCallback(arguments,1);
    if(args.error) { 
		return core.returnError(args);
	}

    var options = args.options ? args.options : {};
    var callback = args.callback ? args.callback : null;

    var req = core.call(config.endpoint,'/getRelatedEntities', {entity: entity, resultsOptions:options}, null, callback)

    if(!callback) {
      // if callback is missing, return a promise
      return req
    }
  }
  
  var getEntitiesByAttribute = function(attributeName, attributeValue, callback) {

    var args = core.getOptionsAndCallback(arguments,2);
    if(args.error) { 
		return core.returnError(args);
	}

    var options = args.options ? args.options : {};
    var callback = args.callback ? args.callback : null;

    var req = core.call(config.endpoint,'/getEntitiesByAttribute', {attribute:{name: attributeName, value: attributeValue}, resultsOptions:options}, null, callback)

    if(!callback) {
      // if callback is missing, return a promise
      return req
    }
  }

  var getEntities = function() {
	
    var args = core.getOptionsAndCallback(arguments,0);
    if(args.error) { 
		return core.returnError(args);
	}

    var options = args.options ? args.options : {};
    var callback = args.callback ? args.callback : null;

    var req = core.call(config.endpoint,'/getEntities', {resultsOptions: options}, null, callback);

    if(!callback) {
      // if callback is missing, return a promise
      return req;
    }
  }

  var search = function(searchTerm) {
	  
    var args = core.getOptionsAndCallback(arguments,1);
    if(args.error) { 
		return core.returnError(args);
	}

    var options = args.options ? args.options : {};
    var callback = args.callback ? args.callback : null;

    /*
    * Make sure there is a searchTerm added and check the formatting (needs to be string)
    */
    if(typeof(searchTerm) != 'string' || searchTerm.length == 0) {
      return core.returnError({error: {type: 'ArgumentError', data: 'Search term is either missing or not a string'}}, callback)
    }
	
	//copy over options from provided options to resultsOptionson the parameter object
	var parameters = {};
    if(options) {
      if(options.relatedResults) {
        parameters = {...parameters, relatedResults: options.relatedResults}
      }

      if(options.spellingSuggestions) {
        parameters = {...parameters, spellingSuggestions: options.spellingSuggestions}
      }

      if(options.sortBy) {
        parameters['resultsOptions'] = {...parameters['resultsOptions'], sortBy: options.sortBy}
      }

      if(options.filter) {
        parameters['resultsOptions'] = {...parameters['resultsOptions'], filter: options.filter}
      }

      if(options.take) {
        parameters['resultsOptions'] = {...parameters['resultsOptions'], take: options.take}
      }

      if(options.skip) {
        parameters['resultsOptions'] = {...parameters['resultsOptions'], skip: options.skip}
      }

      if(options.facets && Array.isArray(options.facets)) {
        parameters['resultsOptions'] = {...parameters['resultsOptions'], facets: options.facets}
      }
    }

    var req = core.call(config.endpoint,'/search', {query: searchTerm, ...parameters}, null, callback)

    if(!callback) { // if callback is missing, return a promise
      return req
    }
  }

  return {
    setConfig: setConfig,
    getConfig: getConfig,
    autoComplete: autoComplete,
    getRelatedEntities: getRelatedEntities,
    getEntities: getEntities,
	getEntitiesByAttribute:getEntitiesByAttribute,
    search: search,
    trackEvent: trackEvent,
    trackEvents: trackEvents
  }
})();
