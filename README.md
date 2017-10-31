# Loop54 API library - javascript edition

## Installation:

Using Node Package Manager (NPM):

1. install the package with `npm install --save loop54-js-lib`

2. require it in your project with `require('loop54-js-lib')`

3. you should now have access to the global variable `Loop54`

## Usage

### features

* Search
* Autocomplete
* GetEntities
* RelatedEntities
* TrackEvent(s)

### Configure

All configuration options are optional, but for it to work with your engine you will need to set the endpoint to match the one you will get from Loop54.

**Configuration Example**
```
Loop54.setConfig({
  endpoint: URL_TO_LOOP54_ENDPOINT,
  facets: [
      {
        name: 'Category',
        attribute: 'Category1',
        type: 'distinct'
      },{
        name: 'price',
        attribute: 'price',
        facetType: 'range',
      }
    ]
})
```

### Search
**Returning Promise**
```
var search = Loop54.search('apple')
search.then(function(response) {
  console.log(response)
})
```

or

```
Loop54.search('apple').then(function(response) {
  console.log(response)
})
```

**Using callback**
```
Loop54.search('apple', function(response) {
  console.log(response)
})
```

**Passing in options with your search**
```
Loop54.search('apple', {selectedFacets: [{'Category': ['Fruit', 'Vegetables']}]}, function(response) {
  console.log(response)
})
```

**Options**

| Argument        | Type  | Value |
| ----------      | ----- | ----- |
| SelectedFacets  | Array | Should be an array containing objects that has the Name of the facet as Key and an array or object with the selected facets as value |

### Autocomplete


## Development

`npm run dev` to start the webserver, open up http://localhost:3001 and try out the basic features

## Tests

`npm run test` to do check if the tests passes

All tests are located in the `test` folder
