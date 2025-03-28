# JS-Connector

Javascript Wrapper for Loop54 JSON V3 API

## How to install

### Using `<script>` tag

1. Download `loop54-js-connector.js` (for development) from
   <https://static.loop54.com/lib/js/loop54-js-connector.js> or
   `loop54-js-connector.min.js` (for production) from
   <https://static.loop54.com/lib/js/loop54-js-connector.min.js>
2. Host the file on your own servers or the CDN on your choice
3. Include a `<script>` tag with an `src` attribute that points to your hosted file
4. You should now have access to the global variable `Loop54`.
5. Create and use a Loop54 client as [explained below](#how-to-use)

### Using Node Package Manager (NPM) as AMD (wg. RequireJS) or CJS (eg. NodeJS):

1. Install the package with `npm install --save loop54-js-connector`
2. Require it in your project with `require('loop54-js-connector');` or with `define(["loop54-js-connector"], function(getClient) { /* ... */ })`
3. Create and use a Loop54 client as [explained below](#how-to-use)

### Using Node Package Manager (NPM) in a ESM environment (eg. Babel):

1. Install the package with `npm install --save loop54-js-connector`
2. Require it in your project with `const getClient = require('loop54-js-connector');` or `import getClient from 'loop54-js-connector';`
3. Create and use a Loop54 client as [explained below](#how-to-use)

## How to use

### Transpilation

If you're using NPM to include the connector in your build pipeline, (for instance using Rollup or Webpack),
note that the module is exported as a pure ES6 module, and it is not bundled with dependencies, transpiled or otherwise prepared for live environment.
You will need to make those preparations as part of your own pipeline.

### Configure

When creating a client, you will need to set the endpoint to match the one you will get from Loop54.

If you included `loop54-js-connector.js` (or `loop54-js-connector.min.js`) in a script tag,
you can get a configured client from the global Loop54 object:

__Get client from global Loop54 object__

```js
var client = Loop54.getClient('URL_TO_YOUR_ENDPOINT');
```

If you imported the connector as an ECMAScript module (with require('loop54-js-connector') or equivalent),
you can call the getClient function directly:

__Get client from imported function__

```js
var client = getClient('URL_TO_YOUR_ENDPOINT');
```

### Making API requests

__Search example with promise__

```js
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

```js
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

The `options` and `callback` parameters are optional. As seen above,
`client.search` will return a Promise.

All API operations work the same way with regards to `options` and `callback`.

__Cancelling a request__

All requests can be cancelled, which is useful when the user types fast.

Using promise:

```js
const request = client.search("R2 droids", {}); //create request
request.then(response => if(!response.cancelled) console.log('done')); //attach continuation
request.cancel(); // cancel the request
```

Using callback:

```js
var callback = function(response) { if(!response.cancelled) console.log('done'); } //create callback
const request = client.search("R2 droids", {}, callback);  //create request
request.cancel(); // cancel the request
```

__Create events example__

```js
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

If you for some reason want to handle user ID:s yourself instead of letting the
Connector do it using cookies, you can set the user ID when retrieving a client
like this:

__Configuration example with custom user ID__

```js
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
- GetIndexedAttributes
- GetIndexedAttributeValues

It also aids in developing a Loop54 integration by:

- Taking care of user ID and cookies (note that you need to ask your users'
  consent)
- Setting required HTTP headers
- Serializing and deserializing requests and responses
- Friendlier error handling than HTTP error codes for common mistakes
- Tested in Chrome 69, Safari 12, Firefox 62, Opera 56, IE 11, and Edge 42

## Developing the library

A Linux or MacOS environment is required. Windows is not supported and the npm commands below will fail on it.

### Development

1. Git clone this repository
2. in the folder, run `npm install` to install all dependencies
3. run `npm run dev` to start the webserver, open up
   http://localhost:3001/#search and try out the basic features

### Pull requests

Before creating a pull request:
- commit your changes
- update the package's version number in `package.json`
- run `npm run sync-version`
  - This synchronises the versions in `package.json`, `package-lock.json` and `core.js`.
- commit the version related changes with the new version number as the commit message, e.g. `1.14`.
- push to remote and open pull request

Committing version related changes separately from implementation makes it easier to cherry-pick specific changes.
Also, spotting version increments in the git history is much quicker.

### Build

run `npm run bundle` to build the source code into /lib folder

### Tests

`npm run test` to do check if the tests passes

All tests are located in the `test` folder

### Contributors
Thanks to [Doru Moisa](https://github.com/moisadoru) for [PR #1](https://github.com/LoopFiftyFour/JS-Connector/pull/1)
