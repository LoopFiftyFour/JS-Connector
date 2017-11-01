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

##### from [ Integer ]

A number representing from which index/item you want to get results.

__Default:__ `{ from: 0 }` (index starts at 0)
```
{
  from: 10
}
```

##### to [ Integer ]

A number representing to which index/item you want to get results.

__Default:__ `{ to: 4 }`
```
{
  to: 19
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

##### relatedResults [ Object ]

Passing options for __relatedResults__ lets you control how your related results list will behave.  

__Default:__ Empty

```
{
  relatedResults: {
    from: 0,
    to: 10,
    sortBy: []
  }
}
```

##### relatedQueries [ Object ]

Control how relatedQueries will behave.

_Sorting relatedQueries is a bit different from the normal results. You have the option to sort by __relevance__, __popularity__ and __alphabetic___

__Default:__ Empty

```
{
  relatedQueries: {
    from: 0,
    to: 10,
    sortBy: []
  }
}
```

##### spellingSuggestions [ Object ]

Control how spellingSuggestions will behave.

_Sorting spellingSuggestions is a bit different from the normal results. You have the option to sort by __relevance__, __popularity__ and __alphabetic___

__Default:__ Empty

```
{
  relatedQueries: {
    from: 0,
    to: 10,
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
							"Vegeables"
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


#### Options

## Development

`npm run dev` to start the webserver, open up http://localhost:3001 and try out the basic features

## Tests

`npm run test` to do check if the tests passes

All tests are located in the `test` folder
