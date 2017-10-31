import axios from 'axios';
import cookies from './cookies.js';

global.Loop54 = (function() {
  var versions = {
    libVersion: '1.0.0',
    apiVersion: 'V26'
  }

  var config = {
    endpoint: 'newapi-test.54proxy.com',
    facets: null
  }

  var _setUserId = function() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    cookies.setItem('Loop54User', text, 365);
    return text;
  }

  var _getUserId = function() {
    var existing = cookies.getItem('Loop54User');
    if (existing) {
      return existing;
    }
    return _setUserId();
  }

  var _call = function(path, body, method, callback) {
    var userId = _getUserId()
    body = {...body}
    var request = axios({
      method: method ? method : 'post',
      url: 'https://' + config.endpoint + path,
      headers: {
        'user-id': userId,
        'lib-version': versions.libVersion,
        'api-version': versions.apiVersion,
      },
      responseType: 'stream',
      data: body
    }).then(function(response) {
      if(response.status == 200) {
        return {status: response.status, data: response.data}
      } else {
        throw new Error({error: {status: response.status, data: response.data}})
      }
    }).catch(function(response) {
      return Promise.reject(response);
    })

    if(callback) {
      request.then(callback)
    } else {
      return request
    }
  }

  var _returnError = function(message, callback) {
    if(callback) {
      if(config.debug) { console.error(message) }
      return callback(message)
    } else {
      if(config.debug) { console.error(message) }
      return message
    }
  }

  var _checkArguments = function(callback, args) {
    var options = null
    if(typeof(callback) != 'function' && args.length == 2) {
      if(typeof(callback) == 'object' && !Array.isArray(callback)) {
        options = callback
        callback = null
      } else {
        return {
          error: {
            type: 'ArgumentError',
            data: 'Bad arguments format, check your function arguments for errors',
            errors: {
              key: i,
              reason: 'Not an object or object is an Array (needs to be key/value object)'
            }
          }
        }
      }
    }

    if(typeof(callback) != 'function' && args.length > 2) {
      var errors = []
      for(var i=0;i<args.length;i++) {
        if(i == 1) {
          if(typeof(args[i]) == 'object' && !Array.isArray(args[i])) {
            options = args[i]
          } else { errors.push({key: i, reason: 'Not an object or object is an Array (needs to be key/value object)'}) }
        }
        if(i == 2) {
          if(typeof(args[i]) == 'function') {
            callback = args[i]
          } else {
            callback = null
            errors.push({key: i, reason: 'Not a function'})
          }
        }
      }

      if(errors.length > 0) {
        return _returnError({error: {type: 'ArgumentError', data: 'Bad arguments format, check your search() arguments for errors', errors: errors}}, callback)
      }
    }

    return {options: options, callback: callback}
  }

  var setConfig = function(newConfig) {
    if(!newConfig || typeof(newConfig) != 'object') { return _returnError({ type: 'ArgumentError', data: 'Arguments missing or they have the wrong format' })}
    if(newConfig.endpoint) { newConfig.endpoint = newConfig.endpoint.replace(/^(https?):\/\/|\/(?=[^\/]*$)/g, '') }
    config = { ...config, ...newConfig }
  }

  var getConfig = function() {
    return config;
  }

  var autocomplete = function(searchTerm, callback) {
    var parameters
    var args = _checkArguments(callback, arguments)
    if(args.error) { return _returnError(args) }

    parameters = args.options ? args.options : {}
    callback = args.callback ? args.callback : null

    var req = _call('/autocomplete', {query: searchTerm, ...parameters}, null, callback)

    if(!callback) {
      // if callback is missing, return a promise
      return req
    }
  }

  var trackEvent = function(eventType, type, id, orderId, quantity, revenue) {
    // purchase, addToCart, click

    if(!eventType) { return _returnError("eventType needs to be set, our standard events are 'click', 'addtocart' and 'purchase'") }
    if(!type) { return _returnError("All entities needs to have a type set, usually this is 'Product' but can basically be anything") }
    if(!id) { return _returnError("All entities needs to have an 'id' provided, this is usually the productId") }

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

    _call('/createEvents', {events: [event]})
  }

  var trackEvents = function(events) {
    // purchase, addToCart, click

    _call('/createEvents', {events: events})
  }

  var relatedEntities = function(entity, callback) {
    /*
    *
    *     same as similar products
    *
    */
    var parameters
    var args = _checkArguments(callback, arguments)
    if(args.error) { return _returnError(args) }

    parameters = args.options ? args.options : {}
    callback = args.callback ? args.callback : null

    var req = _call('/getRelatedEntities', {entity: {...entity}, ...parameters}, null, callback)

    if(!callback) {
      // if callback is missing, return a promise
      return req
    }
  }

  var deleteEntities = function(arg, callback) {} // will implement later
  var updateEntities = function(arg, callback) {} // will implement later

  var getEntities = function(results, callback) {
    var parameters
    var args = _checkArguments(callback, arguments)
    if(args.error) { return _returnError(args) }

    parameters = args.options ? args.options : {}
    callback = args.callback ? args.callback : null

    var req = _call('/getEntities', {results: {...results}, ...parameters}, null, callback)

    if(!callback) {
      // if callback is missing, return a promise
      return req
    }
  }

  var productsInCategory = function(searchTerm, callback) {} // will implement later

  var search = function(searchTerm, callback) {
    var parameters = {}, options
    var args = _checkArguments(callback, arguments)
    if(args.error) { return _returnError(args) }

    options = args.options ? args.options : {}
    callback = args.callback ? args.callback : null

    /*
    * Make sure there is a searchTerm added and check the formatting (needs to be string)
    */
    if(typeof(searchTerm) != 'string' || searchTerm.length == 0) {
      return _returnError({error: {type: 'ArgumentError', data: 'Search term is either missing or not a string'}}, callback)
    }
    if(options) {
      if(options.relatedResults) {
        parameters = {...parameters, relatedResults: options.relatedResults}
      }

      if(options.spellingSuggestions) {
        parameters = {...parameters, spellingSuggestions: options.spellingSuggestions}
      }

      if(options.sortBy) {
        parameters['results'] = {...parameters['results'], sortBy: options.sortBy}
      }

      if(options.filter) {
        parameters['results'] = {...parameters['results'], filter: options.filter}
      }

      if(options.facets && Array.isArray(options.facets)) {
        parameters['results'] = {...parameters['results'], facets: options.facets}
      } else if(config.facets && Array.isArray(config.facets)) {
        parameters['results'] = {...parameters['results'], facets: config.facets}
      }

      if(options.selectedFacets && typeof(options.selectedFacets) == 'object') {
        if(parameters['results'] && parameters['results'].facets) {
          for(var i=0; i<parameters['results'].facets.length; i++) {
            parameters['results'].facets[i] = {...parameters['results'].facets[i], selected: options.selectedFacets[parameters['results'].facets[i].name]}
          }
        }
      }

      if(options.customData) {
        parameters = {...parameters, customData: options.customData}
      }
    }

    var req = _call('/search', {query: searchTerm, ...parameters}, null, callback)

    if(!callback) { // if callback is missing, return a promise
      return req
    }
  }

  return {
    setConfig: setConfig,
    getConfig: getConfig,
    autocomplete: autocomplete,
    relatedEntities: relatedEntities,
    getEntities: getEntities,
    search: search,
    trackEvent: trackEvent,
    trackEvents: trackEvents
  }
})();
