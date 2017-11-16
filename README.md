# Loop54 API library - javascript edition

## Installation

Using Node Package Manager (NPM):

1. install the package with `npm install --save loop54-js-lib`

2. require it in your project with `require('loop54-js-lib')`

3. you should now have access to the global variable `Loop54`

## Development

1. Git clone this repository  
2. in the folder, run `npm install` to install all dependencies  
3. run `npm run dev` to start the webserver, open up http://localhost:3001 and try out the basic features

## Build

run `npm run build` to build the source code into /lib folder

## Tests

`npm run test` to do check if the tests passes

All tests are located in the `test` folder

## Usage

### features

* Search
* Autocomplete
* TrackEvent
* TrackEvents
* GetEntities
* GetRelatedEntities

### Configure

All configuration options are optional, but for it to work with your engine you will need to set the endpoint to match the one you will get from Loop54.

__Configuration Example__
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

If you want to read the config, you can use the following function
```
var config = Loop54.getConfig()
console.log(config)
```

-----------------------
### Search

This is used to send a search string to the API and get a list of results back.  
Below are some basic example of how to use this function, you can also add extra options to customize your search results to fit your needs.

The search function can take 3 arguments.  
`Loop54.search(<searchString>, <options|callback>, <callback>)`

__Required:__ searchString  
__Optional:__ options and callback

If you don't include a callback it will return a Promise, but if you include a callback it will use that and will not return a Promise.

__Returning a Promise__
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

__Using callback__
```
Loop54.search('apple', function(response) {
  console.log(response)
})
```

__Passing in options with your search__
```
Loop54.search('apple', {selectedFacets: [{'Category': ['Fruit', 'Vegetables']}]}, function(response) {
  console.log(response)
})
```

#### Options
You are not required to use options and if you don't you will get the default options.

Options can be passed as a second argument, it has to be an object with one or multiple of the following options, this means you can combine more then one of the following options to suit your implementation needs.

##### selectedFacets [ Object ]

selectedFacets is an Object with one or multiple facets. Each item needs to have the Facet __Name as Key__ and and __Array or Object as Value__. Depending on if it's a range facet or a distinct facet it has to be either and Array or Object.

Range facet example:
```
{
  selectedFacets: {
    'Price': {
      min: 10,
      max: 120
    }
  }
}
```

Distinct facet example:
```
{
  selectedFacets: {
    'Category': [
      'Toys',
      'Lego Starwars'
    ]
  }
}
```

##### skip [ Integer ]

A number representing how many items to skip.

__Default:__ Empty

If you want to get item 9 to 14 (index starts at 0) you will have to add the following as an option
```
{
  skip: 10
}
```

##### take [ Integer ]

A number representing how many items to take.

__Default:__ `{ take: 5 }`

If you want to get 10 items instead of the default 5, you will have to add the following as an option
```
{
  take: 19
}
```

##### sortBy [ Array ]

It's possible to change the sorting of results by adding an Array of Object(s) with either an __attribute__, __type__, __relevance__ or __popularity__.  
When you add more then one Object, they will be sorted in the order of importance.  
So if you first sort by _Name_ and then by _Price_ it will give you a list sorted by _Name_ and where the _Name_ is the same, it will also be sorted by _Price_.

_It's optional to include __order__ in each Object._

__Default:__ `[{ type: 'relevance', order: 'desc' }]`

```
{
  sortBy: [
    {
      type: 'attribute',
      attribute: 'name', // Can be any attribute that your products have
      order: 'asc'
    },
    {
      type: 'type',
      order: 'desc'
    },
    {
      type: 'relevance',
      order: 'desc'
    },
    {
      type: 'popularity',
      order: 'asc'
    }
  ]
}
```

##### facets [ Array ]

It is possible to send specific facets with each Search call, if you don't want to send it with every call you can set the facets in the global configuration (Check the "Configure" section in this document) and it will be included instead.

Possible types are __distinct__ and __range__ depending on what type of facet you want.  
__distinct__ facet will give you an Array of strings as a result.  
__range__ facet will give you a _min_ and a _max_ value for the range.

__Default:__ Empty or Facets from global "Config" if present

```
{
  facets: [
    {
      name: 'Category',
      attribute: 'Category1',
      type: 'distinct'
    },
    {
      name: 'Price',
      attribute: 'PriceInclVat',
      type: 'range'
    }
  ]
}
```

##### filter [ Object ]

It is possible to filter your __Search__ result by passing a __filter__ Object with your request.  

Read more about __Filter__ under the __How To__ section about __Filter__ further down in this document.

__Default:__ Empty

```
{
  filter: {}
}
```

##### relatedResults [ Object ]

Passing options for __relatedResults__ lets you control how your related results list will behave.  

__Default:__ Empty

```
{
  relatedResults: {
    skip: 0,
    take: 10,
    sortBy: []
  }
}
```

##### relatedQueries [ Object ]

Control how __relatedQueries__ will behave.

_Sorting relatedQueries is a bit different from the normal results. You have the option to sort by __relevance__, __popularity__ and __alphabetic___

__Default:__ Empty

```
{
  relatedQueries: {
    skip: 0,
    take: 10,
    sortBy: []
  }
}
```

##### spellingSuggestions [ Object ]

Control how __spellingSuggestions__ will behave.

_Sorting spellingSuggestions is a bit different from the normal results. You have the option to sort by __relevance__, __popularity__ and __alphabetic___

__Default:__ Empty

```
{
  spellingSuggestions: {
    skip: 0,
    take: 10,
    sortBy: []
  }
}
```

#### Response Schema

This is an example of how a __Search response__ object will be structured.  
```
{
	"makesSense": true,
	"spellingSuggestions": {
		"count": 0,
		"items": []
	},
	"relatedQueries": {
		"count": 0,
		"items": []
	},
	"results": {
		"count": 1,
		"facets": [],
		"items": [
			{
				"type": "Product",
				"id": "1234",
				"attributes": [
					{
						"name": "Name",
						"type": "string",
						"values": [
							"Apple"
						]
					},
					{
						"name": "Description",
						"type": "string",
						"values": [
							"An apple is a fruit"
						]
					},
					{
						"name": "ManufacturerName",
						"type": "string",
						"values": [
							"Mother Earth"
						]
					},
					{
						"name": "Categories",
						"type": "string",
						"values": [
							"Fruit",
							"Vegetables"
						]
					},
					{
						"name": "Price",
						"type": "number",
						"values": [
							10.2
						]
					}
				]
			}
		]
	},
	"relatedResults": {
		"count": 0,
		"facets": [],
		"items": []
	}
}
```

-----------------------

### Autocomplete

This is used to send a Autocomplete request to the API.  
Below are some basic example of how to use this function, you can also add extra options to customize your search results to fit your needs.

The search function can take 3 arguments.  
`Loop54.autocomplete(<searchString>, <options|callback>, <callback>)`

__Required:__ searchString  
__Optional:__ options and callback

If you don't include a callback it will return a Promise, but if you include a callback it will use that and will not return a Promise.

__Returning a Promise__
```
var autocomplete = Loop54.autocomplete('appl')
autocomplete.then(function(response) {
  console.log(response)
})
```

or

```
Loop54.autocomplete('appl').then(function(response) {
  console.log(response)
})
```

__Using callback__
```
Loop54.autocomplete('appl', function(response) {
  console.log(response)
})
```

__Passing in options with your autocomplete
```
Loop54.autocomplete('appl', {queries: {skip: 5, take: 10}]}, function(response) {
  console.log(response)
})
```

#### Options

Options for autocomplete needs to be scoped under a __queries__ Object as seen below.  
If you want to use more than one option you just put them in the same __queries__ Object.

##### skip [ Integer ]

A number representing how many items to skip.

__Default:__ Empty

If you want to get item 9 to 14 (index starts at 0) you will have to add the following as an option
```
{
  skip: 10
}
```

##### take [ Integer ]

A number representing how many items to take.

__Default:__ `{ take: 5 }`

If you want to get 10 items instead of the default 5, you will have to add the following as an option
```
{
  take: 19
}
```

##### sortBy [ Array ]

It's possible to change the sorting of results by adding an Array of Object(s) with either an __relevance__, __popularity__ or __alphabetic___.  
When you add more then one Object, they will be sorted in the order of importance.

_It's optional to include __order__ in each Object._

__Default:__ `[{ type: 'relevance', order: 'desc' }]`

```
{
  queries: {
    sortBy: [
      {
        type: 'alphabetic',
        order: 'asc'
      },
      {
        type: 'relevance',
        order: 'desc'
      },
      {
        type: 'popularity',
        order: 'asc'
      }
    ]
  }
}
```

#### Response Schema

All responses consists of two Objects, one __scopedQueries__ and one __queries__ Object.

__scopedQuery__: the most relevant query with scopes (categories) it can facet on.   
__queries__: all matching queries in an Array, they are sorted by relevance by default, see __Options__ if you need to change that behavior.

```
{
	"scopedQuery": {
		"query": "Apple",
		"scopes": [
			"Fruit",
			"Vegetables"
		]
	},
	"queries": {
		"count": 2,
		"items": [
			{ "query": "Apple" },
			{ "query": "Apple pie" }
		]
	}
}
```

-----------------------

### trackEvent

This function sends a single event to the API.  
_If you want to send multiple events at the same time you need to look at trackEvents._

trackEvent can track the following events by default, but if requested it may support custom events as well.

#### Click  
To track a click event you will have to use the following format
```
// Loop54.trackEvent(eventType, type, id)

Loop54.trackEvent('click', 'Product', '1234')
```
__'click'__: the type of Event you are sending  
__'Product'__: the type of entity you are tracking, normally it's 'Product' but could be any other type  
__'1234'__: the ID of the entity (Product in this case) that has been clicked on

#### AddToCart  
To track a addToCart event you will have to use the following format
```
// Loop54.trackEvent(eventType, type, id)

Loop54.trackEvent('addtocart', 'Product', '1234')
```
__'addtocart'__: the type of Event you are sending  
__'Product'__: the type of entity you are tracking, normally it's 'Product' but could be any other type  
__'1234'__: the ID of the entity (Product in this case) that has been clicked on

#### Purchase  
To track a purchase event you will have to use the following format
```
// Loop54.trackEvent(eventType, type, id, orderId, quantity, revenue)

Loop54.trackEvent('purchase', 'Product', '1234', '9999', '23', '1021.5')
```
__'purchase'__: the __type of Event__ you are sending  
__'Product'__: the __type of entity__ you are tracking, normally it's 'Product' but could be any other type  
__'1234'__: the __Id__ of the entity (Product in this case) that has been clicked on  
__'9999'__: (_Optional_) the __orderId__ of the order to which the purchase belongs  
__'23'__: (_Optional_) the __quantity__  
__'1021.5'__: (_Optional_) the __revenue__ gained from this entity

#### Response

A successful trackEvent will return a HTTP status `204` (No Content).

-----------------------

### trackEvents

TrackEvents lets you track multiple events in one API call, this is useful for instance when you want to add purchase events for a whole shopping cart at once.

_If you want to track a single event you are better off using __trackEvent__, which helps you make it less complicated._

__trackEvents__ accepts an Object with an "events" Array, see the following example for an idea of how it can be used.
```
Loop54.trackEvents({
  events: [
    {
      type: 'click',
      entity: {
        type: 'Product',
        id: '1234'
      }
    },
    {
      type: 'addtocart',
      entity: {
        type: 'Product',
        id: '1234'
      }
    },
    {
      type: 'purchase',
      orderId: '9999', // optional
      quantity: '23', // optional
      revenue: '1021.5', // optional
      entity: {
        type: 'Product',
        id: '1234'
      }
    }
  ]
})
```

#### Response

A successful trackEvents will return a HTTP status `204` (No Content).

-----------------------

### getEntities

Used to get a list of Entities from the API. To use this function effectively you will need to know how Filters work. To read more about Filter see the __How To__ section about __Filter__ below.

The getEntities function can take 2 arguments.  
`Loop54.getEntities(<options>, <callback>)`

__Required:__ none  
__Optional:__ options and callback

If you don't include a callback it will return a Promise, but if you include a callback it will use that and will not return a Promise.

__Returning a Promise__
```
var getEntities = Loop54.getEntities({})
getEntities.then(function(response) {
  console.log(response)
})
```

or

```
Loop54.getEntities({}).then(function(response) {
  console.log(response)
})
```

__Using callback__
```
Loop54.getEntities({}, function(response) {
  console.log(response)
})
```

__Passing in options with your search__
```
Loop54.getEntities({skip: 10, take: 100, filter: {}}, function(response) {
  console.log(response)
})
```

-----------------------

### getRelatedEntities

The getRelatedEntities function can take 2 arguments.  
`Loop54.getRelatedEntities(<entity>, <options|callback>, <callback>)`

__Required:__ entity  
__Optional:__ options and callback

If you don't include a callback it will return a Promise, but if you include a callback it will use that and will not return a Promise.

__Returning a Promise__
```
var getRelatedEntities = Loop54.getRelatedEntities({type: 'Product', id: '1234'})
getRelatedEntities.then(function(response) {
  console.log(response)
})
```

or

```
Loop54.getRelatedEntities({type: 'Product', id: '1234'}).then(function(response) {
  console.log(response)
})
```

__Using callback__
```
Loop54.getRelatedEntities({type: 'Product', id: '1234'}, function(response) {
  console.log(response)
})
```

__Passing in options with your search__
```
Loop54.getRelatedEntities({type: 'Product', id: '1234'}, {results: {skip: 10, take: 100}, function(response) {
  console.log(response)
})
```

## How To

### Filter

```
// type == 'Product' AND (ManufacturerName != 'Alf' OR ManufacturerName != 'alga')

{
	filter: {
		and: [
			{
				type: 'type',
				value: 'Product'
			},
			{
				not: {
					or: [
						{
							type: 'attribute',
							attribute: 'ManufacturerName',
							value: 'Alf'
						},
						{
							type: 'attribute',
							attribute: 'ManufacturerName',
							value: 'alga'
						}
					]
				}
			}
		]
	}
}
```
