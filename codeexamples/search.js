 
function searchExample(client, query) {
	console.log("search-full:");
	
	// CODE SAMPLE search-full BEGIN
	// The search field
	// initialize "Search" request and set search query
	
	//specify number of response items
	var options = {};
	options.skip = 0;
	options.take = 10;
	var relatedResultsOptions = {}
	relatedResultsOptions.skip = 0;
	relatedResultsOptions.take = 9;
	options.relatedResultOptions = relatedResultsOptions;
	
	//fetch response from engine
	var response = client.search(query, options); 
	response = response.then((r) => {
										var searchResponseData = r.data;
										// INJECT SAMPLE search-check-results BEGIN
										checkResults(searchResponseData);
										// INJECT SAMPLE END
										
										//render direct results
										var results = searchResponseData["results"].items;
										if (!results || results.count == 0)
										{
											console.log("There were no items matching your search.");
										}
										else
										{
											for (let resultItem of results)
											{
												var productId = resultItem.id;
												var productTitle = resultItem.attributes ? resultItem.attributes.find(function(a){return a.name=="Title"}).values[0] : "";
												console.log(productId + " " + productTitle); //render a product on the search results page
											}
										}

										//render recommended results
										var relatedResults = searchResponseData["relatedResults"].items;
										if (relatedResults && relatedResults.count > 0)
										{
											console.log("Maybe you also want these?");
											for (let resultItem of relatedResults)
											{
												var productId = resultItem.id;
												var productTitle = resultItem.attributes ? resultItem.attributes.find(function(a){return a.name=="Title"}).values[0] : "";
												console.log(productId + " " + productTitle); //render a product on the search results page
											}
										}
									}
							);
	// CODE SAMPLE END
	return response.then((r)=>console.log("search-full (end)"))
};

function searchCheckResultExample(client, query) {
	console.log("search-check-result:");
	
	// initialize "Search" request and set search query
	
	//specify number of response items
	var options = {};
	options.skip = 0;
	options.take = 10;
	var relatedResultsOptions = {}
	relatedResultsOptions.skip = 0;
	relatedResultsOptions.take = 9;
	options.relatedResultOptions = relatedResultsOptions;
	
	//fetch response from engine
	var response = client.search(query, options); 
	response = response.then((r) => {
										var searchResponseData = r.data;
										checkResults(searchResponseData);
									}
							);
	return response.then((r)=>console.log("search-check-result (end)"))
};

function checkResults(data)
{
	// CODE SAMPLE search-check-results BEGIN
	// Check the search results
	// if the result does not make sense, show error message
	// (note that there may still be results!)
	if (!data["makesSense"])
		console.log("We did not understand your query.");

	//render spelling suggestions
	if (data["spellingSuggestions"] && data["spellingSuggestions"].count > 0)
	{
		var queries = data["spellingSuggestions"].items.map(o => o.query);
		console.log("Did you mean: " + queries.join() + "?");
	}
	// CODE SAMPLE END
};



        