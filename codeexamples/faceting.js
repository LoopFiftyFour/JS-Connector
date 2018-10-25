function facetingSingleFacetExample(client, query)
{
	console.log("faceting-single-facet:");
	console.log("items: ");

	// CODE SAMPLE faceting-single-facet BEGIN
	// Search with a single facet
	
	// Add facets to the search request 
	var distinctFacets = [];
	distinctFacets.push({name:'Category',attributeName:'Category',type:'distinct'});
	var options = {};
    options.facets = distinctFacets;

	var response = client.search(query, options); 
	// CODE SAMPLE END
	
	response = response.then((r) => {
										renderItems(r.data);
										renderFacets(r.data);
									}
								);
							
	return response.then((r)=>console.log("faceting-single-facet (end)"))
}

function facetingMultipleFacetsExample(client, query)
{
	console.log("faceting-multiple-facets:");
	console.log("items: ");

	// CODE SAMPLE faceting-multiple-facets BEGIN
	// Search with multiple facets
	
	// Add facets to the search request 
	var distinctFacetNames = ["Manufacturer", "Category"];
	var distinctFacets = distinctFacetNames.map(function(f){return {name:f,attributeName:f,type:'distinct'}});
	var options = {};
	options.facets = distinctFacets;
	
	var response = client.search(query, options);
	// CODE SAMPLE END

	response = response.then((r) => {
										renderItems(r.data);
										renderFacets(r.data);
									}
								);
							
	return response.then((r)=>console.log("faceting-multiple-facets (end)"))
}

function facetingEngineResponseExample(client, query)
{
	console.log("faceting-engine-response:");
	console.log("items: ");
	
	//Add facets to the search request 
	var distinctFacetNames = ["Manufacturer", "Category"];
	var distinctFacets = distinctFacetNames.map(function(f){return {name:f,attributeName:f,type:'distinct'}});
	var options = {};
	options.facets = distinctFacets;
	
	var response = client.search(query, options);

	response = response.then((r) => {
										renderItems(r.data);
										renderFacets(r.data);
									}
								);
							
	return response.then((r)=>console.log("faceting-engine-response (end)"))
}

function facetingDistinctFacetExample(client, query, specificManufacturer)
{	
	console.log("faceting-distinct-facet:");
	console.log("items: ");
	
	// CODE SAMPLE faceting-distinct-facet BEGIN
	// Search with a distinct facet applied
	// The use-case here is e.g. when the user clicks on a specific manufacturer in the search result facet list
	
	// Add facets to the search request 
	// And select a specific facet value to filter on
	var options = {};
	var distinctFacetNames = ["Manufacturer", "Category", "Organic"];
	
	var selectedFacets = {};
	selectedFacets["Manufacturer"] = [];
	selectedFacets["Manufacturer"].push(specificManufacturer);
	selectedFacets["Category"] = [];
	selectedFacets["Organic"] = [];
	
	var distinctFacets = distinctFacetNames.map(function(f){return {name:f,attributeName:f,type:'distinct',selected:selectedFacets[f]}});
	var rangeFacetNames = ["Price"];
	var rangeFacets = rangeFacetNames.map(function(f){return {name:f,attributeName:f,type:'range'}});
	options.facets = distinctFacets.concat(rangeFacets);
	
	var response = client.search(query, options);
	
	// CODE SAMPLE END

	response = response.then((r) => {
										renderItems(r.data);
										renderFacets(r.data);
									}
								);
							
	return response.then((r)=>console.log("faceting-distinct-facet (end)"))
}

function facetingRangeFacetExample(client, query)
{
	console.log("faceting-range-facet:");
	console.log("items: ");

	// CODE SAMPLE faceting-range-facet BEGIN
	// Search with a range facet
	// The use-case here is e.g. when the user selects a specific price range in the search result facet list
	
	//Add facets to the search request
	//And select a specific range for a certain facet
	var options = {};
	var distinctFacetNames = ["Manufacturer", "Category", "Organic"];
	var distinctFacets = distinctFacetNames.map(function(f){return {name:f,attributeName:f,type:'distinct'}});
	var selectedRange = {min: 10, max: 60};
	var rangeFacetNames = ["Price"];
	var rangeFacets = rangeFacetNames.map(function(f){return {name:f,attributeName:f,type:'range',selected:selectedRange}});
	options.facets = distinctFacets.concat(rangeFacets);
	
	var response = client.search(query, options);
	// CODE SAMPLE END

	response = response.then((r) => {
										renderItems(r.data);
										renderFacets(r.data);
									}
								);
							
	return response.then((r)=>console.log("faceting-range-facet (end)"))
}

function renderItems(data)
{
    var results = data["results"].items;

	if (!results || results.length == 0)
	{
		console.log("There were no items.");
	}
	else
	{
		for (let resultItem of results)
		{
			var productId = resultItem.id;
			var productTitle = resultItem.attributes ? resultItem.attributes.find(function(a){return a.name=="Title"}).values[0] : "";
			var price = resultItem.attributes ? resultItem.attributes.find(function(a){return a.name=="Price"}).values[0] : "";
			console.log(productId + " " + productTitle + " (" + price + " kr), ");
		}
	}	
}

function renderFacets(data)
{
	// CODE SAMPLE render-distinct-facets BEGIN
	var distinctFacetsToDisplay = ["Manufacturer", "Category", "Organic"];
	if(data.results && data.results.facets.length > 0) 
	{
		for (let attributeName of distinctFacetsToDisplay)
		{
			var facets = data.results.facets.filter(function(f) { return f.type == 'distinct' && f.name == attributeName; });
			if (facets && facets.length > 0)
			{
				var facet = facets[0];
				if(facet)
				{	
					var facetItems = facet.items;
					if (facetItems && facetItems.length > 0)
						console.log(attributeName + ": ");
					for (let facetItem of facetItems)
					{
						console.log(facetItem.item + ": " + facetItem.count); // Write the facet name and the number of products in the facet 
					}
				}
			}
		}
	}
	
	// CODE SAMPLE END

	//if there is a price range facet
	if(data.results && data.results.facets.length > 0) 
	{
		var facets = data.results.facets.filter(function(f) { return f.type == 'range' && f.name == "Price"; });
		if (facets && facets.length > 0)
		{
			var facet = facets[0];
			if(facet)
			{
				console.log("Price: ");
				var minPrice = facet.min;
				var maxPrice = facet.max;
				var minPriceSelected = facet.selectedMin;
				var maxPriceSelected = facet.selectedMax;
				console.log("min: " + minPrice + " kr, max: " + maxPrice +
								" kr, min selected: " + minPriceSelected + " kr," +
								" max selected: " + maxPriceSelected + " kr.");				
			}
		}
	}
}


        

       

       

      
        

       
        


        