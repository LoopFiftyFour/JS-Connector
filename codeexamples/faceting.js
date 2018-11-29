function facetingSingleFacetExample(client, query)
{
	console.log("faceting-single-facet:");
	console.log("items: ");

	// CODE SAMPLE faceting-single-facet BEGIN
	// Search with a single facet
	
	// Add facets to the search request 
	var response = client.search(
		query, 
		{
			facets: [
				{name:"Category",attributeName:"Category",type:"distinct"}
			]
		}
	); 
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
	var response = client.search(
		query, 
		{
			facets: ["Manufacturer","Category"].map(function(f){return {name:f,attributeName:f,type:"distinct"}})
		}
	);
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
	var response = client.search(query, {facets: ["Manufacturer", "Category"].map(function(f){return {name:f,attributeName:f,type:"distinct"}})});

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
	var selectedFacets = {
		"Manufacturer": [specificManufacturer],
		"Category": [],
		"Organic": []
	};
	
	var distinctFacets = ["Manufacturer", "Category", "Organic"].map(function(f){return {name:f,attributeName:f,type:"distinct",selected:selectedFacets[f]}});
	var rangeFacets = ["Price"].map(function(f){return {name:f,attributeName:f,type:"range"}});
	
	var response = client.search(query, {facets: distinctFacets.concat(rangeFacets)});
	
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
	var distinctFacets = ["Manufacturer", "Category", "Organic"].map(function(f){return {name:f,attributeName:f,type:"distinct"}});
	var rangeFacets = ["Price"].map(function(f){return {name:f,attributeName:f,type:"range",selected:{min: 10, max: 60}}});
	
    var response = client.search(query, { facets: distinctFacets.concat(rangeFacets)});
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
		console.log("Total number of items: " + data["results"].count);
		for (var i in results)
		{
			var productId = results[i].id;
			var productTitle = results[i].attributes ? results[i].attributes.find(function(a){return a.name=="Title"}).values[0] : "";
			var price = results[i].attributes ? results[i].attributes.find(function(a){return a.name=="Price"}).values[0] : "";
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
		for (var i in distinctFacetsToDisplay)
		{
			var facet = data.results.facets.find(function(f) { return f.type == "distinct" && f.name == distinctFacetsToDisplay[i];});
			if(facet)
			{	
				var facetItems = facet.items;
				if (facetItems && facetItems.length > 0)
					console.log(distinctFacetsToDisplay[i] + ": ");
				for (var j in facetItems)
				{
					console.log(facetItems[j].item + ": " + facetItems[j].count); // Write the facet name and the number of products in the facet 
				}
			}
		}
	}
	
	// CODE SAMPLE END

	//if there is a price range facet
	if(data.results && data.results.facets.length > 0) 
	{
		var facet = data.results.facets.find(function(f) { return f.type == "range" && f.name == "Price"; });
		if(facet)
		{
			console.log("Price: ");
			console.log("min: " + facet.min + " kr, max: " + facet.max +
							" kr, min selected: " + facet.selectedMin + " kr," +
							" max selected: " + facet.selectedMax + " kr.");		
		}
	}
}