# JS-Connector

Javascript Wrapper for Loop54 JSON V3 API

## How to install

### Using Node Package Manager (NPM):

1. Install the package with `npm install --save loop54-js-connector`
2. Require it in your project with `require('loop54-js-connector')`
3. You should now have access to the global variable `Loop54`

### Using `<script>` tag

1. Download `loop54-js-connector.js` (for development) from <http://files.loop54.com/files/libs/loop54-js-connector.js> or `loop54-js-connector.min.js` (for production) from <http://files.loop54.com/files/libs/loop54-js-connector.min.js>
2. Host the file on your own servers or the CDN on your choice
3. Include a `<script>` tag with an `src` attribute that points to your hosted file

## How to use

### Configure

You will need to set the endpoint to match the one you will get from Loop54.

__Configuration example__
```
var client = Loop54.getClient('URL_TO_YOUR_ENDPOINT');
```

### Making API requests

__Search example with promise__
```
var options = {skip:0,take:20}; //this will take the first 20 results

client.search("R2 droids", options)
	.then(function(response){
		if(response.data.error) {
			console.log(response.data.error.title);
		} else {
			console.log("found " + response.data.results.count + " results");
		}
	});
```

__Search example with callback__
```
var options = {skip:0,take:20}; //this will take the first 20 results

var callback = function(response){
	if(response.data.error) {
		console.log(response.data.error.title);
	} else {
		console.log("found " + response.data.results.count + " results");
	}
}

client.search("R2 droids", options, callback);
```

The `options` and `callback` parameters are optional. As seen above, if the `callback` is omitted, `client.search` will return a Promise.

All API operations work the same way with regards to `options` and `callback`, except createEvent and createEvents which do not take `options`.

__Create events example__

```
var entity = {type:"Product",id:"1234"};

var callback = function(response){
	if(response.data.error) {
		console.log(response.data.error.title);
	} else {
		console.log("success");
	}
}

client.createEvent("click",entity,null,null,null,callback);
```

See http://docs.loop54.com for more code samples.

### But wait! I don't want the Connector to handle user ID:s for me!

If you for some reason want to handle user ID:S yourself instead of letting the Connector do it using cookies. You can set the user ID when retrieving your client like this:

__Configuration example with custom user ID__
```
var client = Loop54.getClient('URL_TO_YOUR_ENDPOINT','YOUR_USER_ID');
```

### Features

The connector supports the following API operations:

- Search
- Autocomplete
- GetEntities
- GetEntitiesByAttribute
- GetRelatedEntities
- CreateEvent
- CreateEvents

It also aids in developing a Loop54 integration by:

- Taking care of user ID and cookies (note that you need to ask your users' consent)
- Setting required HTTP headers
- Serializing and deserializing requests and responses
- Friendlier error handling than HTTP error codes for common mistakes
- Tested in Chrome 69, Safari 12, Firefox 62, Opera 56, IE 11, and Edge 42

## Developing the library

### Development

1. Git clone this repository  
2. in the folder, run `npm install` to install all dependencies  
3. run `npm run dev` to start the webserver, open up http://localhost:3001/#search and try out the basic features

### Build

run `npm run bundle` to build the source code into /lib folder

### Tests

`npm run test` to do check if the tests passes

All tests are located in the `test` folder