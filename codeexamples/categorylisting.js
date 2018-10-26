 
function categoryListingExample(client, categoryName) {
	console.log("categorylisting-full:");
	console.log("items:");
	// CODE SAMPLE categorylisting-full BEGIN
	// Below is an example of a request - response cycle of a category listing request
	var options = {};
	options.skip = 0;
	options.take = 9;
	
	var response = client.getEntitiesByAttribute('Category', categoryName, options); 
	
	response = response.then((r) => {
										var data = r.data
										// INJECT SAMPLE render-items BEGIN
										renderItems(data);
										// INJECT SAMPLE END
									}
							);
	// CODE SAMPLE END
	return response.then((r)=>console.log("categorylisting-full (end)"))
};

function categoryListingFacetsExample(client, categoryName) {
	console.log("categorylisting-facets:");
	console.log("items:");
	// CODE SAMPLE categorylisting-facets BEGIN
	// Category listing with facets
	var options = {};
	var distinctFacetNames = ["Manufacturer", "Category", "Organic"];
	var distinctFacets = distinctFacetNames.map(function(f){return {name:f,attributeName:f,type:'distinct'}});
	var rangeFacetNames = ["Price"];
	var rangeFacets = rangeFacetNames.map(function(f){return {name:f,attributeName:f,type:'range'}});
	options.facets = distinctFacets.concat(rangeFacets);
	
	var response = client.getEntitiesByAttribute('Category', categoryName, options); 
	
	response = response.then((r) => {
										var data = r.data
										// INJECT SAMPLE render-items BEGIN
										renderItems(data);
										// INJECT SAMPLE END
										// INJECT SAMPLE render-distinct-facets BEGIN
										renderFacets(data);
										// INJECT SAMPLE END
									}
							);
	// CODE SAMPLE END
	return response.then((r)=>console.log("categorylisting-facets (end)"))
};

function categoryListingDistinctFacetExample(client, categoryName, specificManufacturer)
{
	console.log("categorylisting-distinct-facet:");
	console.log("items: ");

	// CODE SAMPLE categorylisting-distinct-facet BEGIN
	// Category listing with a distinct facet applied
	// The use-case here is e.g. when the user clicks on a specific manufacturer in the category listing facet list
	// Add facets to the request 
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
	
	var response = client.getEntitiesByAttribute('Category', categoryName, options);
	
	// CODE SAMPLE END
	response = response.then((r) => {
									var data = r.data
									renderItemsExtended(data);
									renderFacets(data);
								}
						);
						
	return response.then((r)=>console.log("categorylisting-distinct-facet (end)"))
}

function categoryListingRangeFacetExample(client, categoryName)
{
	console.log("categorylisting-range-facet:");
	console.log("items: ");

	// CODE SAMPLE categorylisting-range-facet BEGIN
	// Category listing with a range facet
	// The use-case here is e.g. when the user selects a specific price range in the category listing facet list
	// Add facets to the request 
	// And select a specific range for a certain facet
	var options = {};
	var distinctFacetNames = ["Manufacturer", "Category", "Organic"];
	var distinctFacets = distinctFacetNames.map(function(f){return {name:f,attributeName:f,type:'distinct'}});
	var selectedRange = {min: 10, max: 60};
	var rangeFacetNames = ["Price"];
	var rangeFacets = rangeFacetNames.map(function(f){return {name:f,attributeName:f,type:'range',selected:selectedRange}});
	options.facets = distinctFacets.concat(rangeFacets);
	
	var response = client.getEntitiesByAttribute('Category', categoryName, options);
	// CODE SAMPLE END
	
	response = response.then((r) => {
									var data = r.data
									renderItemsExtended(data);
									renderFacets(data);
								}
						);
						
	return response.then((r)=>console.log("categorylisting-range-facet (end)"))
}

function categoryListingSortingExample(client, categoryName)
{
	console.log("categorylisting-sorting:");
	console.log("items: ");

	// CODE SAMPLE categorylisting-sorting BEGIN
	// Category listing with sorting
	// Set the sort order of the products in the category
	var options = {};
	var sortBy = [];
	sortBy.push({type:"attribute", attributeName:"Price", order:"asc"});// Primary sorting: Sort on attribute Price, ascending order
	sortBy.push({type:"popularity", order:"desc"});// Secondary sorting: Sort on popularity, descending order
	options.sortBy = sortBy;
	
	var response = client.getEntitiesByAttribute('Category', categoryName, options);
	// CODE SAMPLE END
	
	response = response.then((r) => {
							var data = r.data
							renderItemsExtended(data);
						}
				);
					
	return response.then((r)=>console.log("categorylisting-sorting (end)"))
}

function categoryListingFilterExample(client, categoryName)
{
	console.log("categorylisting-filter:");
	console.log("items: ");

	// CODE SAMPLE categorylisting-filter BEGIN
	// Category listing with filters
	// Filter the products in the category
	// In this case, we only want products that have got
	// the price attribute, and where the organic attribute is set to "True"
	var options = {};
	var filter = {and:[]}; // And filter, contains a list of other filters
	filter.and.push({attributeName:"Price"}); // The price attribute must exist
	filter.and.push({type:"attribute", attributeName:"Organic", value:"True"}); // The Organic attribute must be set to "True"
	options.filter = filter;

	var response = client.getEntitiesByAttribute('Category', categoryName, options);
	// CODE SAMPLE END

	response = response.then((r) => {
							var data = r.data
							renderItemsExtended(data);
						}
				);
					
	return response.then((r)=>console.log("categorylisting-filter (end)"))
}

function renderItems(data)
{
	// CODE SAMPLE render-items BEGIN
	var results = data["results"].items;
	
	if (!results || results.length == 0)
	{
		console.log("There were no items in this category.");
	}
	else
	{
		for (let resultItem of results)
		{
			var productId = resultItem.id;
			var productTitle = resultItem.attributes ? resultItem.attributes.find(function(a){return a.name=="Title"}).values[0] : "";
			console.log(productId + " " + productTitle); //render a product on the category listing page
		}
	}	
	// CODE SAMPLE END
}

function renderItemsExtended(data)
{
	var results = data["results"].items;

	if (!results || results.length == 0)
	{
		console.log("There were no items in this category.");
	}
	else
	{
		for (let resultItem of results)
		{
			var productId = resultItem.id;
			var productTitle = resultItem.attributes ? resultItem.attributes.find(function(a){return a.name=="Title"}).values[0] : "";
			var price = resultItem.attributes ? resultItem.attributes.find(function(a){return a.name=="Price"}).values[0] : "";
			var organic = resultItem.attributes ? resultItem.attributes.find(function(a){return a.name=="Organic"}).values[0] : "";
			console.log(productId + " " + productTitle + " (" + price + " kr, " + organic + "), "); //render a product on the category listing page
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

 



        

       

       

      
        

       
        


        