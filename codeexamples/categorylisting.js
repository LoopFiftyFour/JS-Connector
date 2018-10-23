 
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
										// INJECT SAMPLE render-items BEGIN
										renderItems(r.data);
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
	options.facets = distinctFacets.concat(rangeFacets);;
	
	var response = client.getEntitiesByAttribute('Category', categoryName, options); 
	
	
	
	response = response.then((r) => {
										// INJECT SAMPLE render-items BEGIN
										renderItems(r.data);
										// INJECT SAMPLE END
										// INJECT SAMPLE render-distinct-facets BEGIN
										renderFacets(r.data);
										// INJECT SAMPLE END
									}
							);
	// CODE SAMPLE END
	return response.then((r)=>console.log("categorylisting-facets (end)"))
};

function renderItems(data)
{
	// CODE SAMPLE render-items BEGIN
	var results = data["results"].items;
	
	if (!results || results.count == 0)
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




        // private void CategoryListingDistinctFacetExample(string categoryName, string specificManufacturer)
        // {
            // Debug.WriteLine("categorylisting-distinct-facet: " + Environment.NewLine);
            // Debug.WriteLine("items: ");

            // // CODE SAMPLE categorylisting-distinct-facet BEGIN
            // // Category listing with a distinct facet applied
            // // The use-case here is e.g. when the user clicks on a specific manufacturer in the category listing facet list
            // var request = new GetEntitiesByAttributeRequest("Category", categoryName);

            // //Add facets to the request 
            // //And select a specific facet value to filter on
            // request.ResultsOptions.AddDistinctFacet<string>("Manufacturer", new List<string>() { specificManufacturer });
            // request.ResultsOptions.AddDistinctFacet<string>("Category");
            // request.ResultsOptions.AddDistinctFacet<string>("Organic");
            // request.ResultsOptions.AddRangeFacet<double>("Price");

            // var response = _loop54Client.GetEntitiesByAttribute(request);
            // // CODE SAMPLE END

            // RenderItemsExtended(response);
            // RenderFacets(response);
            // Debug.WriteLine("categorylisting-distinct-facet (end) " + Environment.NewLine);
        // }

        // private void CategoryListingRangeFacetExample(string categoryName)
        // {
            // Debug.WriteLine("categorylisting-range-facet: " + Environment.NewLine);
            // Debug.WriteLine("items: ");

            // // CODE SAMPLE categorylisting-range-facet BEGIN
            // // Category listing with a range facet
            // // The use-case here is e.g. when the user selects a specific price range in the category listing facet list
            // var request = new GetEntitiesByAttributeRequest("Category", categoryName);

            // //Add facets to the request 
            // //And select a specific range for a certain facet
            // request.ResultsOptions.AddDistinctFacet<string>("Manufacturer");
            // request.ResultsOptions.AddDistinctFacet<string>("Category");
            // request.ResultsOptions.AddDistinctFacet<string>("Organic");
            // request.ResultsOptions.AddRangeFacet<double>("Price", new RangeFacetSelectedParameter<double>() { Min = 10, Max = 60 });

            // var response = _loop54Client.GetEntitiesByAttribute(request);
            // // CODE SAMPLE END

            // RenderItemsExtended(response);
            // RenderFacets(response);

            // Debug.WriteLine("categorylisting-range-facet (end) " + Environment.NewLine);
        // }

        // private void CategoryListingSortingExample(string categoryName)
        // {
            // Debug.WriteLine("categorylisting-sorting: " + Environment.NewLine);
            // Debug.WriteLine("items: ");

            // // CODE SAMPLE categorylisting-sorting BEGIN
            // // Category listing with sorting
            // var request = new GetEntitiesByAttributeRequest("Category", categoryName);

            // //Set the sort order of the products in the category
            // request.ResultsOptions.SortBy = new List<EntitySortingParameter>{
                // new EntitySortingParameter("Price")
                    // { Order = SortOrders.Asc}, // Primary sorting: Sort on attribute Price, ascending order
                // new EntitySortingParameter(EntitySortingParameter.Types.Popularity)
                    // { Order = SortOrders.Desc} // Secondary sorting: Sort on popularity, descending order
            // };

            // var response = _loop54Client.GetEntitiesByAttribute(request);
            // // CODE SAMPLE END

            // RenderItemsExtended(response);

            // Debug.WriteLine("categorylisting-sorting (end) " + Environment.NewLine);
        // }

        // private void CategoryListingFilterExample(string categoryName)
        // {
            // Debug.WriteLine("categorylisting-filter: " + Environment.NewLine);
            // Debug.WriteLine("items: ");

            // // CODE SAMPLE categorylisting-filter BEGIN
            // // Category listing with filters
            // var request = new GetEntitiesByAttributeRequest("Category", categoryName);

            // //Filter the products in the category
            // //In this case, we only want products that have got
            // //the price attribute, and where the organic attribute is set to "True"
            // request.ResultsOptions.Filter = new AndFilterParameter(
                // new AttributeExistsFilterParameter("Price"),
                // //Because the organic attribute is stored as a string in the engine we need to filter with that type.                
                // //If it would have been stored as a boolean we would have used bool instead.
                // new AttributeFilterParameter<string>("Organic", "True")
            // );

            // var response = _loop54Client.GetEntitiesByAttribute(request);
            // // CODE SAMPLE END

            // RenderItemsExtended(response);

            // Debug.WriteLine("categorylisting-filter (end) " + Environment.NewLine);
        // }
        // #endregion

        // #region HelperMethods
        

        // private void RenderItemsExtended(GetEntitiesByAttributeResponse response)
        // {
            // var results = response.Results.Items;

            // if (!results.Any())
                // Debug.WriteLine("There were no items in this category.");

            // foreach (var resultItem in results)
            // {
                // var productId = resultItem.GetAttributeValueOrDefault<string>("Id");
                // var productTitle = resultItem.GetAttributeValueOrDefault<string>("Title");
                // var price = resultItem.GetAttributeValueOrDefault<double>("Price");
                // var organic = resultItem.GetAttributeValueOrDefault<string>("Organic");
                // Debug.WriteLine(productId + " " + productTitle + " (" + price + " kr, " + organic + "), ");
                // //render a product on the category listing page
            // }
        // }

        


        